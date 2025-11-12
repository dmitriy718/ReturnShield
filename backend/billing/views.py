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
        logger.info("Received Stripe webhook event: %s", event_type)

        # Future handling: tie events to subscriptions/users once integration is complete.
        return Response({"received": True}, status=status.HTTP_200_OK)
