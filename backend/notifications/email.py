from __future__ import annotations

import logging
from typing import Iterable, Optional

from django.conf import settings
from django.utils.html import format_html
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)


def _is_enabled() -> bool:
    return bool(settings.SENDGRID_API_KEY)


def send_email(
    *,
    to_emails: Iterable[str] | str,
    subject: str,
    html_content: str,
    from_email: Optional[str] = None,
) -> bool:
    """
    Generic helper to send transactional emails via SendGrid.
    """
    if not _is_enabled():
        logger.warning("SendGrid API key is not configured; skipped email send.")
        return False

    from_address = from_email or settings.SENDGRID_FROM_EMAIL
    message = Mail(
        from_email=(from_address, settings.SENDGRID_FROM_NAME),
        to_emails=to_emails,
        subject=subject,
        html_content=html_content,
    )
    try:
        client = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = client.send(message)
        logger.info(
            "SendGrid email dispatched",
            extra={"status_code": response.status_code, "subject": subject},
        )
        return response.status_code in (200, 202)
    except Exception as exc:  # pragma: no cover - logging path
        logger.exception("Failed to send SendGrid email: %s", exc)
        return False


def send_onboarding_email(user) -> bool:
    """
    Welcome new operators with actionable next steps.
    """
    if not getattr(user, "email", None):
        return False

    first_name = user.first_name or user.username or "there"
    subject = "Welcome to ReturnShield — your returns war room is live"
    html_content = format_html(
        """
        <p>Hi {first_name},</p>
        <p><strong>Welcome to ReturnShield.</strong> You now have the toolkit to
        protect contribution margin from runaway returns.</p>
        <p>Here’s how to get value in the next hour:</p>
        <ol>
            <li>Connect Shopify to pull 12 months of orders.</li>
            <li>Switch on automated anomaly alerts for high-risk SKUs.</li>
            <li>Invite your CX lead so they can deploy the ReturnShield playbooks.</li>
        </ol>
        <p>Recover lost revenue faster with these quick wins:</p>
        <ul>
            <li><strong>Exchange nudges</strong> convert 2.4× better than refunds.</li>
            <li><strong>Return reason tagging</strong> spots sizing issues before they snowball.</li>
            <li><strong>Smart policies</strong> autopilot incentives for VIP shoppers.</li>
        </ul>
        <p>Need a hand? Reply to this email and our concierge team will jump in.</p>
        <p>Talk soon,<br/>ReturnShield Concierge</p>
        """,
        first_name=first_name,
    )
    return send_email(
        to_emails=user.email,
        subject=subject,
        html_content=html_content,
    )

