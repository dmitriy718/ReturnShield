from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from django.conf import settings
from posthog import Posthog

logger = logging.getLogger(__name__)

_client: Optional[Posthog] = None
_client_api_key: Optional[str] = None


def _get_client() -> Optional[Posthog]:
    global _client, _client_api_key
    api_key = getattr(settings, "POSTHOG_API_KEY", "")
    if _client is not None and _client_api_key == api_key:
        return _client

    if not api_key:
        _client = None
        _client_api_key = None
        return None

    try:
        _client = Posthog(api_key, host=getattr(settings, "POSTHOG_HOST", "https://app.posthog.com"))
        _client_api_key = api_key
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to initialize PostHog client: %s", exc)
        _client = None
        _client_api_key = None
    return _client


def capture(event: str, distinct_id: str, properties: Optional[Dict[str, Any]] = None) -> None:
    client = _get_client()
    if not client:
        logger.debug("PostHog disabled; skipped capture for %s", event)
        return
    try:
        client.capture(distinct_id=distinct_id, event=event, properties=properties or {})
    except Exception as exc:  # pragma: no cover
        logger.exception("PostHog capture failed for event %s: %s", event, exc)


def identify(distinct_id: str, properties: Optional[Dict[str, Any]] = None) -> None:
    client = _get_client()
    if not client:
        return
    try:
        client.identify(distinct_id=distinct_id, properties=properties or {})
    except Exception as exc:  # pragma: no cover
        logger.exception("PostHog identify failed for %s: %s", distinct_id, exc)

