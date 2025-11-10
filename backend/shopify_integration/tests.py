from unittest import mock
from urllib.parse import urlencode

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from shopify_integration.models import ShopifyInstallation
from shopify_integration.utils import ensure_myshopify_domain, generate_state

User = get_user_model()


@override_settings(
    SHOPIFY_CLIENT_ID="client_id",
    SHOPIFY_CLIENT_SECRET="client_secret",
    SHOPIFY_SCOPES=["read_orders", "write_returns"],
    BACKEND_URL="https://api.returnshield.app",
)
class ShopifyIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="merchant",
            email="merchant@returnshield.app",
            password="StrongPass123!",
        )

    def test_install_url_requires_auth(self):
        response = self.client.post(
            reverse("shopify_integration:install-url"),
            {"shop_domain": "brand"},
            format="json",
        )
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    @mock.patch("shopify_integration.views.capture_event")
    def test_install_url_generates_record(self, mock_capture):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            reverse("shopify_integration:install-url"),
            {"shop_domain": "brand"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        install = ShopifyInstallation.objects.get(shop_domain="brand.myshopify.com")
        self.assertEqual(install.user, self.user)
        self.assertFalse(install.active)
        self.assertEqual(payload["state"], install.state)
        mock_capture.assert_called_once()

    @mock.patch("shopify_integration.views.capture_event")
    @mock.patch("shopify_integration.views.requests.post")
    def test_callback_marks_install_active(self, mock_post, mock_capture):
        self.client.force_authenticate(self.user)
        # Create pending installation
        state = generate_state()
        installation = ShopifyInstallation.objects.create(
            user=self.user,
            shop_domain="brand.myshopify.com",
            state=state,
        )

        params = {
            "code": "authcode",
            "shop": "brand.myshopify.com",
            "state": state,
        }
        # Generate valid hmac
        from django.conf import settings
        import hashlib, hmac
        sorted_params = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
        hmac_value = hmac.new(
            settings.SHOPIFY_CLIENT_SECRET.encode("utf-8"),
            sorted_params.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

        mock_post.return_value.json.return_value = {"access_token": "token", "scope": "read_orders"}
        mock_post.return_value.raise_for_status.return_value = None

        response = self.client.get(
            reverse("shopify_integration:callback") + "?" + urlencode({**params, "hmac": hmac_value})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        installation.refresh_from_db()
        self.assertTrue(installation.active)
        self.assertEqual(installation.access_token, "token")
        self.assertEqual(installation.scope, "read_orders")
        self.user.refresh_from_db()
        self.assertEqual(self.user.shopify_domain, "brand.myshopify.com")
        mock_capture.assert_called_once()
