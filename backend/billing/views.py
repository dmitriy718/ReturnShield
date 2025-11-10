from __future__ import annotations

import logging
from typing import Any, Dict

import stripe
from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

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
