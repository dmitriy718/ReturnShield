from __future__ import annotations

from typing import List

from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class PlatformStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        platforms = _get_platform_status()
        return Response({"platforms": platforms})


def _get_platform_status() -> List[dict]:
    """Return static platform availability metadata for marketing surfaces."""
    return [
        {
            "slug": "shopify",
            "name": "Shopify",
            "status": "live",
            "badge": "Available now",
            "description": "Install the ReturnShield partner app, sync historical orders, and deploy automation within hours.",
            "cta_label": "Install Shopify connector",
            "cta_url": _with_base_query(settings.APP_FRONTEND_URL, "platform=shopify"),
        },
        {
            "slug": "bigcommerce",
            "name": "BigCommerce",
            "status": "beta",
            "badge": "Beta access",
            "description": "Pilot merchants can connect BigCommerce stores with guided onboarding and webhook automation.",
            "cta_label": "Join BigCommerce beta",
            "cta_url": _with_base_query(settings.APP_FRONTEND_URL, "platform=bigcommerce"),
        },
        {
            "slug": "woocommerce",
            "name": "WooCommerce",
            "status": "pilot",
            "badge": "Pilot waitlist",
            "description": "Secure REST API integration with nightly syncs and tailored playbooks for WooCommerce retailers.",
            "cta_label": "Request WooCommerce pilot",
            "cta_url": _with_base_query(settings.APP_FRONTEND_URL, "platform=woocommerce"),
        },
    ]


def _with_base_query(base_url: str, query: str) -> str:
    joiner = "&" if "?" in base_url else "?"
    return f"{base_url}{joiner}{query}" if base_url else base_url
