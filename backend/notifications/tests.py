from unittest import mock

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from notifications.email import send_email, send_onboarding_email

User = get_user_model()


@override_settings(
    SENDGRID_API_KEY="test-key",
    SENDGRID_FROM_EMAIL="concierge@returnshield.app",
    SENDGRID_FROM_NAME="ReturnShield Concierge",
)
class NotificationsEmailTests(TestCase):
    @mock.patch("notifications.email.SendGridAPIClient")
    def test_send_email_invokes_sendgrid(self, mock_client_cls):
        mock_client = mock_client_cls.return_value
        mock_client.send.return_value.status_code = 202

        result = send_email(
            to_emails="ops@returnshield.app",
            subject="Test",
            html_content="<p>Test</p>",
        )

        self.assertTrue(result)
        mock_client.send.assert_called_once()

    def test_send_email_returns_false_when_disabled(self):
        with override_settings(SENDGRID_API_KEY=""):
            result = send_email(
                to_emails="ops@returnshield.app",
                subject="Test",
                html_content="<p>Test</p>",
            )
        self.assertFalse(result)

    @mock.patch("notifications.email.send_email", return_value=True)
    def test_send_onboarding_email_uses_generic_sender(self, mock_send_email):
        user = User.objects.create_user(
            username="brand",
            email="brand@returnshield.app",
            password="TestStrong123!",
            first_name="Avery",
        )

        result = send_onboarding_email(user)

        self.assertTrue(result)
        mock_send_email.assert_called_once()
