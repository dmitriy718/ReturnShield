from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import patch

from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


@override_settings(
    STRIPE_SECRET_KEY="sk_test_123",
    STRIPE_PRICE_IDS={"launch": "price_launch", "scale": "price_scale"},
    FRONTEND_URL="https://returnshield.app",
)
class CheckoutSessionViewTests(APITestCase):
    @patch("billing.views.stripe.checkout.Session.create")
    def test_checkout_session_created(self, mock_create) -> None:
        mock_create.return_value = SimpleNamespace(url="https://stripe.test/checkout")

        response = self.client.post(
            reverse("billing:create-checkout-session"),
            data={"plan": "launch"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"checkout_url": "https://stripe.test/checkout"})
        mock_create.assert_called_once()

    def test_invalid_plan_returns_400(self) -> None:
        response = self.client.post(
            reverse("billing:create-checkout-session"),
            data={"plan": "invalid"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.json())

    @override_settings(STRIPE_SECRET_KEY="")
    def test_missing_configuration_returns_503(self) -> None:
        response = self.client.post(
            reverse("billing:create-checkout-session"),
            data={"plan": "launch"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertIn("detail", response.json())

    def test_mismatched_price_id_returns_error(self) -> None:
        response = self.client.post(
            reverse("billing:create-checkout-session"),
            data={"plan": "launch", "price_id": "price_wrong"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        body = response.json()
        self.assertIn("detail", body)
        self.assertEqual(body["detail"], "Submitted plan details do not match.")

    @patch("billing.views.stripe.checkout.Session.create")
    def test_matching_price_id_accepted(self, mock_create) -> None:
        mock_create.return_value = SimpleNamespace(url="https://stripe.test/checkout")
        response = self.client.post(
            reverse("billing:create-checkout-session"),
            data={"plan": "launch", "price_id": "price_launch"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"checkout_url": "https://stripe.test/checkout"})


class ActivateSubscriptionViewTests(APITestCase):
    def test_activate_subscription_updates_user(self) -> None:
        user = self._create_user()
        self.client.force_authenticate(user)

        response = self.client.post(
            reverse("billing:activate"),
            data={"plan": "scale"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"subscription_status": "scale"})
        user.refresh_from_db()
        self.assertEqual(user.subscription_status, "scale")

    def test_invalid_plan_rejected(self) -> None:
        user = self._create_user()
        self.client.force_authenticate(user)

        response = self.client.post(
            reverse("billing:activate"),
            data={"plan": "invalid"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def _create_user():
        from django.contrib.auth import get_user_model

        User = get_user_model()
        return User.objects.create_user(
            username="activator",
            email="activator@returnshield.app",
            password="StrongPass123!",
        )


@override_settings(STRIPE_WEBHOOK_SECRET="whsec_test")
class StripeWebhookViewTests(APITestCase):
    def test_missing_webhook_secret_returns_503(self) -> None:
        with self.settings(STRIPE_WEBHOOK_SECRET=""):
            response = self.client.post(reverse("billing:webhook"), data="{}", content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    @patch("billing.views.stripe.Webhook.construct_event")
    def test_invalid_payload_returns_400(self, mock_construct) -> None:
        mock_construct.side_effect = ValueError("invalid payload")
        response = self.client.post(
            reverse("billing:webhook"),
            data="{}",
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="sig_header",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("billing.views.stripe.Webhook.construct_event")
    def test_invalid_signature_returns_400(self, mock_construct) -> None:
        import stripe

        mock_construct.side_effect = stripe.error.SignatureVerificationError("bad sig", "sig_header")
        response = self.client.post(
            reverse("billing:webhook"),
            data="{}",
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="sig_header",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("billing.views.stripe.Webhook.construct_event")
    def test_valid_event_returns_200(self, mock_construct) -> None:
        mock_construct.return_value = {"type": "checkout.session.completed", "data": {"object": {"id": "cs_123"}}}
        response = self.client.post(
            reverse("billing:webhook"),
            data="{}",
            content_type="application/json",
            HTTP_STRIPE_SIGNATURE="sig_header",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"received": True})
