from __future__ import annotations

import hashlib
import hmac
import secrets
from typing import Dict
from urllib.parse import urlencode

from django.conf import settings


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
    sorted_params = "&".join(
        f"{key}={value}"
        for key, value in sorted(params.items())
        if key != "hmac"
    )
    digest = hmac.new(
        settings.SHOPIFY_CLIENT_SECRET.encode("utf-8"),
        sorted_params.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(digest, provided_hmac)

