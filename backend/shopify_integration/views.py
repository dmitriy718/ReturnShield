import logging
from typing import Dict

import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.posthog import capture as capture_event
from shopify_integration.models import ShopifyInstallation

from .serializers import InstallRequestSerializer
from .utils import build_install_url, ensure_myshopify_domain, generate_state, verify_hmac

logger = logging.getLogger(__name__)


class ShopifyInstallUrlView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not (settings.SHOPIFY_CLIENT_ID and settings.SHOPIFY_CLIENT_SECRET):
            return Response(
                {"detail": "Shopify app credentials are not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = InstallRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        shop_domain = serializer.validated_data["shop_domain"]

        state = generate_state()
        installation, created = ShopifyInstallation.objects.update_or_create(
            shop_domain=shop_domain,
            defaults={
                "user": request.user,
                "state": state,
                "active": False,
            },
        )

        install_url = build_install_url(shop_domain=shop_domain, state=state)
        capture_event(
            "shopify_install_initiated",
            distinct_id=str(request.user.pk),
            properties={
                "shop_domain": shop_domain,
                "existing_install": not created,
            },
        )
        return Response({"install_url": install_url, "state": state})


class ShopifyCallbackView(APIView):
    permission_classes: list = []  # Shopify callback

    def get(self, request, *args, **kwargs):
        params: Dict[str, str] = request.query_params.dict()
        logger.debug("Shopify callback params: %s", params)

        hmac_value = params.get("hmac")
        code = params.get("code")
        state = params.get("state")
        shop = params.get("shop")

        if not all([hmac_value, code, state, shop]):
            return Response({"detail": "Missing parameters."}, status=status.HTTP_400_BAD_REQUEST)

        shop_domain = ensure_myshopify_domain(shop)

        if not verify_hmac(params, hmac_value):
            return Response({"detail": "Invalid HMAC signature."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            installation = ShopifyInstallation.objects.get(state=state, shop_domain=shop_domain)
        except ShopifyInstallation.DoesNotExist:
            return Response({"detail": "Unknown installation request."}, status=status.HTTP_400_BAD_REQUEST)

        token_url = f"https://{shop_domain}/admin/oauth/access_token"
        try:
            response = requests.post(
                token_url,
                json={
                    "client_id": settings.SHOPIFY_CLIENT_ID,
                    "client_secret": settings.SHOPIFY_CLIENT_SECRET,
                    "code": code,
                },
                timeout=15,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            logger.exception("Failed to exchange Shopify token: %s", exc)
            return Response({"detail": "Failed to finalize Shopify install."}, status=502)

        payload = response.json()
        access_token = payload.get("access_token")
        scope = payload.get("scope", "")

        if not access_token:
            return Response({"detail": "Shopify response missing access token."}, status=502)

        installation.mark_installed(access_token=access_token, scope=scope)

        user = installation.user
        user.shopify_domain = shop_domain
        user.onboarding_stage = "sync"
        user.save(update_fields=["shopify_domain", "onboarding_stage"])

        capture_event(
            "shopify_install_completed",
            distinct_id=str(user.pk),
            properties={
                "shop_domain": shop_domain,
                "scope": scope,
            },
        )

        return Response(
            {
                "status": "installed",
                "shop_domain": shop_domain,
                "installed_at": timezone.now(),
            },
            status=status.HTTP_200_OK,
        )
