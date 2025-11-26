from __future__ import annotations

import hashlib
import hmac
import logging
import secrets
from typing import Dict
from urllib.parse import urlencode

from django.conf import settings

logger = logging.getLogger(__name__)


def ensure_myshopify_domain(shop: str) -> str:
    shop = shop.strip()
    if not shop.endswith(".myshopify.com"):
        shop = f"{shop}.myshopify.com"
    return shop.lower()


def generate_state() -> str:
    return secrets.token_urlsafe(32)


def build_install_url(*, shop_domain: str, state: str) -> str:
    params = {
        "client_id": settings.SHOPIFY_CLIENT_ID,
        "scope": ",".join(settings.SHOPIFY_SCOPES),
        "redirect_uri": f"{settings.BACKEND_URL.rstrip('/')}/api/shopify/callback/",
        "state": state,
    }
    return f"https://{shop_domain}/admin/oauth/authorize?{urlencode(params)}"


def verify_hmac(params: Dict[str, str], provided_hmac: str) -> bool:
    """
    Ensure the callback originates from Shopify.
    """
    # Per Shopify: build a message by sorting all query params (except hmac/signature)
    # as 'key=value' joined with '&' using the received (decoded) values.
    sorted_params = "&".join(
        f"{key}={value}"
        for key, value in sorted(params.items())
        if key not in {"hmac", "signature"}
    )
    digest = hmac.new(
        settings.SHOPIFY_CLIENT_SECRET.encode("utf-8"),
        sorted_params.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if settings.DEBUG or bool(getattr(settings, "SHOPIFY_HMAC_DEBUG", False)):
        logger.info(
            "Shopify HMAC verify | computed=%s provided=%s base='%s'",
            digest,
            provided_hmac,
            sorted_params,
        )
    return hmac.compare_digest(digest, provided_hmac)

