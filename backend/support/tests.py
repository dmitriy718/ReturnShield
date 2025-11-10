from unittest import mock

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from support.services import HelpScoutClient


User = get_user_model()


@override_settings(
    HELPSCOUT_APP_ID="app_id",
    HELPSCOUT_APP_SECRET="app_secret",
    HELPSCOUT_MAILBOX_ID="123456",
)
class HelpScoutClientTests(TestCase):
    def setUp(self):
        cache.clear()

    @mock.patch("support.services.requests.post")
    def test_token_cached_after_first_request(self, mock_post):
        mock_post.return_value.json.return_value = {
            "access_token": "access123",
            "expires_in": 120,
        }
        mock_post.return_value.raise_for_status.return_value = None

        client = HelpScoutClient()
        first = client.get_access_token()
        second = client.get_access_token()

        self.assertEqual(first, "access123")
        self.assertEqual(second, "access123")
        self.assertEqual(mock_post.call_count, 1)

    @mock.patch.object(HelpScoutClient, "get_access_token", return_value="access123")
    @mock.patch("support.services.requests.post")
    def test_create_conversation_payload(self, mock_post, mock_token):
        mock_post.return_value.json.return_value = {"id": 99, "mailboxId": 123456}
        mock_post.return_value.raise_for_status.return_value = None

        client = HelpScoutClient()
        response = client.create_conversation(
            subject="Customer SOS",
            body="We need help asap.",
            customer_email="founder@returnshield.app",
            customer_first_name="Return",
            customer_last_name="Shield",
            tags=["urgent"],
            metadata={"priority": "high"},
        )

        self.assertEqual(response["id"], 99)
        request_kwargs = mock_post.call_args.kwargs
        self.assertEqual(request_kwargs["json"]["mailboxId"], 123456)
        self.assertEqual(request_kwargs["json"]["tags"], ["urgent"])


@override_settings(
    HELPSCOUT_APP_ID="app_id",
    HELPSCOUT_APP_SECRET="app_secret",
    HELPSCOUT_MAILBOX_ID="123456",
)
class SupportMessageViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="returnshield",
            email="ops@returnshield.app",
            password="StrongPass123!",
        )

    def test_authenticated_user_can_create_support_ticket(self):
        payload = {
            "subject": "Launch blocker",
            "message": "Our webhook needs attention.",
            "customer_email": "ops@returnshield.app",
        }

        with mock.patch("support.views.HelpScoutClient") as mock_client_cls:
            mock_client = mock_client_cls.return_value
            mock_client.create_conversation.return_value = {
                "id": 321,
                "mailboxId": 123456,
            }

            self.client.force_authenticate(self.user)
            response = self.client.post("/api/support/messages/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_client.create_conversation.assert_called_once()
        self.assertEqual(response.data["status"], "submitted")
