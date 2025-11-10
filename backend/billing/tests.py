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
