from __future__ import annotations

import time
from typing import Dict, List

from django.conf import settings
from django.db import connection
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class PlatformStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        platforms = _get_platform_status()
        return Response({"platforms": platforms})


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        checks: Dict[str, dict] = {}
        db_result = self._check_database()
        checks["database"] = db_result

        overall_status = "ok" if all(item["healthy"] for item in checks.values()) else "error"

        payload = {
            "status": overall_status,
            "timestamp": timezone.now().isoformat(),
            "debug": settings.DEBUG,
            "checks": checks,
        }
        return Response(payload, status=200 if overall_status == "ok" else 503)

    @staticmethod
    def _check_database() -> dict:
        started = time.monotonic()
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                cursor.fetchone()
            latency_ms = round((time.monotonic() - started) * 1000, 2)
            return {"healthy": True, "latency_ms": latency_ms}
        except Exception as exc:  # pragma: no cover - structure validated in tests
            return {"healthy": False, "error": str(exc)}


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
