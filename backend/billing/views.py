from __future__ import annotations

import logging
from typing import Any, Dict

import stripe
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.posthog import capture as capture_event

logger = logging.getLogger(__name__)


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args: Any, **kwargs: Any) -> Response:
        if not settings.STRIPE_SECRET_KEY:
            return Response(
                {"detail": "Stripe is not configured."}, status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        plan = (request.data.get("plan") or "").lower()
        request_price_id = (request.data.get("price_id") or "").strip()
        configured_price_id = settings.STRIPE_PRICE_IDS.get(plan)

        if request_price_id:
            if request_price_id != configured_price_id:
                return Response(
                    {"detail": "Submitted plan details do not match."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            price_id = request_price_id
        else:
            price_id = configured_price_id

        if not price_id:
            return Response({"detail": "Invalid plan selection."}, status=status.HTTP_400_BAD_REQUEST)

        stripe.api_key = settings.STRIPE_SECRET_KEY

        success_url = (
            (request.data.get("success_url") or "").strip()
            or f"{settings.APP_FRONTEND_URL}/billing/success?session_id={{CHECKOUT_SESSION_ID}}"
        )
        cancel_url = (request.data.get("cancel_url") or "").strip() or f"{settings.FRONTEND_URL}#pricing"

        try:
            session = stripe.checkout.Session.create(  # type: ignore[attr-defined]
                mode="subscription",
                line_items=[{"price": price_id, "quantity": 1}],
                success_url=success_url,
                cancel_url=cancel_url,
                allow_promotion_codes=True,
                billing_address_collection="required",
                metadata={"plan": plan},
            )
        except stripe.error.StripeError as exc:  # type: ignore[attr-defined]
            logger.exception("Stripe checkout session creation failed: %s", exc)
            return Response(
                {"detail": "Unable to initiate checkout at the moment."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"checkout_url": session.url})


class ActivateSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args: Any, **kwargs: Any) -> Response:
        plan = (request.data.get("plan") or "").lower()
        if plan not in {"launch", "scale", "elite"}:
            return Response({"detail": "Unknown plan."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.subscription_status = plan
        user.save(update_fields=["subscription_status"])

        try:
            capture_event(
                "subscription_plan_activated",
                distinct_id=str(user.pk),
                properties={"plan": plan},
            )
        except Exception:  # pragma: no cover
            logger.exception("Failed to record subscription activation for user %s", user.pk)

        return Response({"subscription_status": plan}, status=status.HTTP_200_OK)


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes: list = []

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        if not webhook_secret:
            logger.warning("Stripe webhook called but STRIPE_WEBHOOK_SECRET is not configured.")
            return Response({"detail": "Stripe webhook is not configured."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        payload_bytes = request.body
        try:
            payload = payload_bytes.decode("utf-8")
        except UnicodeDecodeError:
            logger.exception("Failed to decode Stripe webhook payload.")
            return Response({"detail": "Invalid payload encoding."}, status=status.HTTP_400_BAD_REQUEST)

        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        if not sig_header:
            logger.warning("Stripe webhook received without signature header.")
            return Response({"detail": "Missing Stripe signature header."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except ValueError:
            logger.exception("Invalid payload for Stripe webhook.")
            return Response({"detail": "Invalid payload."}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            logger.exception("Stripe webhook signature verification failed.")
            return Response({"detail": "Invalid signature."}, status=status.HTTP_400_BAD_REQUEST)

        event_type = event.get("type", "unknown")
        event_data = event.get("data", {}).get("object", {})
        logger.info("Processing Stripe webhook event: %s", event_type)

        # Process different event types
        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            if event_type == "checkout.session.completed":
                # New subscription activated
                customer_email = event_data.get("customer_details", {}).get("email") # Updated to customer_details.email
                customer_id = event_data.get("customer")
                subscription_id = event_data.get("subscription")
                metadata = event_data.get("metadata", {})
                plan = metadata.get("plan", "").lower()

                if customer_email and plan in ["launch", "scale", "elite"]:
                    try:
                        user = User.objects.get(email=customer_email)
                        user.subscription_status = plan
                        if customer_id:
                            user.stripe_customer_id = customer_id
                        user.save(update_fields=["subscription_status", "stripe_customer_id"])
                        logger.info(
                            "Activated %s subscription for user %s (Stripe session: %s)",
                            plan,
                            user.pk,
                            event_data.get("id"),
                        )

                        capture_event(
                            "subscription_activated_via_webhook",
                            distinct_id=str(user.pk),
                            properties={
                                "plan": plan,
                                "subscription_id": subscription_id,
                                "customer_id": customer_id,
                            },
                        )
                    except User.DoesNotExist:
                        logger.warning(
                            "Stripe checkout completed but user not found: %s (session: %s)",
                            customer_email,
                            event_data.get("id"),
                        )
                else:
                    logger.warning(
                        "Stripe checkout completed with invalid plan or missing email: plan=%s, email=%s",
                        plan,
                        customer_email,
                    )

            elif event_type == "customer.subscription.deleted":
                # Subscription canceled - downgrade to trial
                customer_id = event_data.get("customer")
                subscription_id = event_data.get("id")

                if customer_id:
                    try:
                        user = User.objects.get(stripe_customer_id=customer_id)
                        old_status = user.subscription_status
                        user.subscription_status = "trial"
                        user.save(update_fields=["subscription_status"])
                        logger.info(
                            "Downgraded user %s from %s to trial after cancellation (subscription: %s)",
                            user.pk,
                            old_status,
                            subscription_id,
                        )

                        capture_event(
                            "subscription_canceled_via_webhook",
                            distinct_id=str(user.pk),
                            properties={
                                "previous_plan": old_status,
                                "subscription_id": subscription_id,
                            },
                        )
                    except User.DoesNotExist:
                        logger.warning(
                            "Stripe subscription deleted but user not found: customer_id=%s, subscription=%s",
                            customer_id,
                            subscription_id,
                        )

            elif event_type == "customer.subscription.updated":
                # Subscription plan changed (upgrade/downgrade)
                customer_id = event_data.get("customer")
                subscription_id = event_data.get("id")
                subscription_status = event_data.get("status")
                # Extract price ID from the first item in the subscription
                price_id = None
                if event_data.get("items") and event_data["items"].get("data"):
                    first_item = event_data["items"]["data"][0]
                    if first_item.get("price"):
                        price_id = first_item["price"].get("id")

                # Map price ID to plan name
                plan_mapping = {
                    settings.STRIPE_PRICE_IDS.get("launch"): "launch",
                    settings.STRIPE_PRICE_IDS.get("scale"): "scale",
                    settings.STRIPE_PRICE_IDS.get("elite"): "elite",
                }
                new_plan = plan_mapping.get(price_id)

                if customer_id and new_plan and subscription_status == "active":
                    try:
                        user = User.objects.get(stripe_customer_id=customer_id)
                        old_plan = user.subscription_status
                        user.subscription_status = new_plan
                        user.save(update_fields=["subscription_status"])
                        logger.info(
                            "Updated user %s subscription from %s to %s (subscription: %s)",
                            user.pk,
                            old_plan,
                            new_plan,
                            subscription_id,
                        )

                        capture_event(
                            "subscription_updated_via_webhook",
                            distinct_id=str(user.pk),
                            properties={
                                "previous_plan": old_plan,
                                "new_plan": new_plan,
                                "subscription_id": subscription_id,
                            },
                        )
                    except User.DoesNotExist:
                        logger.warning(
                            "Stripe subscription updated but user not found: customer_id=%s, subscription=%s",
                            customer_id,
                            subscription_id,
                        )

            elif event_type == "invoice.payment_failed":
                # Payment failed - could implement grace period or immediate downgrade
                customer_id = event_data.get("customer")
                subscription_id = event_data.get("subscription")

                if customer_id:
                    try:
                        user = User.objects.get(stripe_customer_id=customer_id)
                        logger.warning(
                            "Payment failed for user %s (subscription: %s) - consider implementing grace period",
                            user.pk,
                            subscription_id,
                        )

                        capture_event(
                            "payment_failed_via_webhook",
                            distinct_id=str(user.pk),
                            properties={"subscription_id": subscription_id},
                        )
                    except User.DoesNotExist:
                        logger.warning(
                            "Payment failed but user not found: customer_id=%s, subscription=%s",
                            customer_id,
                            subscription_id,
                        )

        except Exception as exc:  # pragma: no cover
            logger.exception("Error processing Stripe webhook event %s: %s", event_type, exc)
            # Return 200 anyway to prevent Stripe from retrying
            # The event is logged and can be manually replayed if needed

        return Response({"received": True, "event_type": event_type}, status=status.HTTP_200_OK)
