from __future__ import annotations

import logging
from typing import Any, Dict, Optional

import requests
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

logger = logging.getLogger(__name__)


class HelpScoutClient:
    """
    Lightweight client for HelpScout's Mailbox API.

    Uses the client credentials flow to obtain an access token and caches it
    until expiry to avoid unnecessary authentication calls.
    """

    TOKEN_CACHE_KEY = "helpscout_access_token"
    BASE_URL = "https://api.helpscout.net/v2"

    def __init__(
        self,
        app_id: Optional[str] = None,
        app_secret: Optional[str] = None,
        mailbox_id: Optional[str] = None,
    ) -> None:
        self.app_id = app_id or settings.HELPSCOUT_APP_ID
        self.app_secret = app_secret or settings.HELPSCOUT_APP_SECRET
        self.mailbox_id = mailbox_id or settings.HELPSCOUT_MAILBOX_ID

    def is_configured(self) -> bool:
        return bool(self.app_id and self.app_secret and self.mailbox_id)

    def _cache_timeout(self, expires_in: int) -> int:
        # subtract a minute to ensure we refresh before expiry
        return max(expires_in - 60, 60)

    def get_access_token(self, *, force_refresh: bool = False) -> str:
        token: Optional[str] = None
        if not force_refresh:
            cached: Optional[Dict[str, Any]] = cache.get(self.TOKEN_CACHE_KEY)
            if cached:
                token = cached.get("token")
        if token:
            return token

        if not self.is_configured():
            raise ValueError("HelpScout credentials are not configured.")

        response = requests.post(
            f"{self.BASE_URL}/oauth2/token",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "grant_type": "client_credentials",
                "client_id": self.app_id,
                "client_secret": self.app_secret,
            },
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()
        token = payload["access_token"]
        expires_in = int(payload.get("expires_in", 3600))
        cache.set(
            self.TOKEN_CACHE_KEY,
            {"token": token, "fetched_at": timezone.now()},
            timeout=self._cache_timeout(expires_in),
        )
        return token

    def _headers(self) -> Dict[str, str]:
        token = self.get_access_token()
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def create_conversation(
        self,
        *,
        subject: str,
        body: str,
        customer_email: str,
        customer_first_name: Optional[str] = None,
        customer_last_name: Optional[str] = None,
        tags: Optional[list[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("HelpScout credentials are not configured.")

        payload: Dict[str, Any] = {
            "type": "email",
            "mailboxId": int(self.mailbox_id),
            "subject": subject,
            "status": "active",
            "customer": {
                "email": customer_email,
                "firstName": customer_first_name or "",
                "lastName": customer_last_name or "",
            },
            "threads": [
                {
                    "type": "customer",
                    "status": "active",
                    "text": body,
                    "customer": {
                        "email": customer_email,
                        "firstName": customer_first_name or "",
                        "lastName": customer_last_name or "",
                    },
                }
            ],
        }
        if tags:
            payload["tags"] = tags
        if metadata:
            payload["fields"] = [
                {"name": key, "value": value} for key, value in metadata.items()
            ]

        response = requests.post(
            f"{self.BASE_URL}/conversations",
            headers=self._headers(),
            json=payload,
            timeout=20,
        )

        try:
            response.raise_for_status()
        except requests.HTTPError as exc:
            logger.error(
                "HelpScout conversation creation failed: %s",
                exc,
                extra={"response": response.text},
            )
            raise

        try:
            return response.json()
        except ValueError:
            return {}

