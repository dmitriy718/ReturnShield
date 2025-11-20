from __future__ import annotations

import time
from typing import Dict, List

from django.conf import settings
from django.db import connection
from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
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


class IntegrationsHealthView(APIView):
    """Returns health status of all connected integrations for the authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        health_checks = []

        # Check Shopify integration
        if user.has_shopify_store and user.shopify_domain:
            try:
                from shopify_integration.models import ShopifyInstallation
                installation = ShopifyInstallation.objects.filter(user=user).first()
                if installation:
                    health_checks.append({
                        "platform": "Shopify",
                        "domain": user.shopify_domain,
                        "status": "healthy" if installation.active else "warning",
                        "message": "Store connected and active" if installation.active else "Store connected but inactive",
                        "last_checked_at": timezone.now().isoformat(),
                    })
                else:
                    health_checks.append({
                        "platform": "Shopify",
                        "domain": user.shopify_domain,
                        "status": "warning",
                        "message": "Store domain set but integration not fully configured",
                        "last_checked_at": timezone.now().isoformat(),
                    })
            except Exception as e:
                health_checks.append({
                    "platform": "Shopify",
                    "domain": user.shopify_domain or "Unknown",
                    "status": "error",
                    "message": f"Integration check failed: {str(e)}",
                    "last_checked_at": timezone.now().isoformat(),
                })

        # Check BigCommerce integration
        if user.store_platform == "bigcommerce" and user.store_domain:
            try:
                from bigcommerce_integration.models import BigCommerceInstallation
                installation = getattr(user, 'bigcommerce_installation', None)
                if installation:
                    health_checks.append({
                        "platform": "BigCommerce",
                        "domain": user.store_domain,
                        "status": "healthy" if installation.active else "warning",
                        "message": "Store connected and active" if installation.active else "Store connected but inactive",
                        "last_checked_at": timezone.now().isoformat(),
                    })
                else:
                    health_checks.append({
                        "platform": "BigCommerce",
                        "domain": user.store_domain,
                        "status": "warning",
                        "message": "Store domain set but integration not fully configured",
                        "last_checked_at": timezone.now().isoformat(),
                    })
            except Exception as e:
                health_checks.append({
                    "platform": "BigCommerce",
                    "domain": user.store_domain or "Unknown",
                    "status": "error",
                    "message": f"Integration check failed: {str(e)}",
                    "last_checked_at": timezone.now().isoformat(),
                })

        # Check WooCommerce integration
        if user.store_platform == "woocommerce" and user.store_domain:
            try:
                connection = getattr(user, 'woocommerce_connection', None)
                if connection:
                    health_checks.append({
                        "platform": "WooCommerce",
                        "domain": user.store_domain,
                        "status": "healthy" if connection.active else "warning",
                        "message": "Store connected and active" if connection.active else "Store connected but inactive",
                        "last_checked_at": timezone.now().isoformat(),
                    })
                else:
                    health_checks.append({
                        "platform": "WooCommerce",
                        "domain": user.store_domain,
                        "status": "warning",
                        "message": "Store domain set but integration not fully configured",
                        "last_checked_at": timezone.now().isoformat(),
                    })
            except Exception as e:
                health_checks.append({
                    "platform": "WooCommerce",
                    "domain": user.store_domain or "Unknown",
                    "status": "error",
                    "message": f"Integration check failed: {str(e)}",
                    "last_checked_at": timezone.now().isoformat(),
                })

        if not health_checks:
            return Response([], status=200)

        return Response(health_checks, status=200)


class FeatureFlagsView(APIView):
    """Returns feature flags enabled for the authenticated user based on subscription and waffle flags."""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        flags = []

        # Subscription-based feature flags
        if user.subscription_status in ["launch", "scale", "elite"]:
            flags.append("live_data")
        if user.subscription_status in ["scale", "elite"]:
            flags.append("exchange_automation")
            flags.append("ai_coach")
        if user.subscription_status == "elite":
            flags.append("white_glove_support")
            flags.append("custom_playbooks")
            flags.append("quarterly_workshops")

        # Platform-based feature flags
        if user.has_shopify_store:
            flags.append("shopify_integration")
        if user.store_platform == "bigcommerce":
            flags.append("bigcommerce_integration")
        if user.store_platform == "woocommerce":
            flags.append("woocommerce_integration")

        # Waffle feature flags (if django-waffle is installed)
        try:
            from waffle.models import Flag
            active_flags = Flag.objects.filter(users=user, everyone=False).values_list("name", flat=True)
            flags.extend(active_flags)
        except ImportError:
            pass  # django-waffle not installed or not configured

        return Response(flags, status=200)


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
