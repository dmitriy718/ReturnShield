from unittest import mock

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import WooCommerceConnection


class WooCommerceIntegrationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="woocommerce",
            email="woocommerce@returnshield.app",
            password="StrongPass123!",
        )
        self.client.force_authenticate(self.user)

    @mock.patch("woocommerce_integration.views.requests.get")
    def test_connect_success(self, mock_get):
        mock_get.return_value = mock.Mock(status_code=200, json=lambda: {})

        response = self.client.post(
            reverse("woocommerce_integration:connect"),
            {
                "site_url": "https://store.example.com",
                "consumer_key": "ck_123",
                "consumer_secret": "cs_456",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        connection = WooCommerceConnection.objects.get(user=self.user)
        self.assertTrue(connection.active)
        self.user.refresh_from_db()
        self.assertEqual(self.user.store_platform, User.StorePlatform.WOOCOMMERCE)

    @mock.patch("woocommerce_integration.views.requests.get")
    def test_connect_failure(self, mock_get):
        mock_get.return_value = mock.Mock(status_code=403, json=lambda: {})

        response = self.client.post(
            reverse("woocommerce_integration:connect"),
            {
                "site_url": "https://store.example.com",
                "consumer_key": "invalid",
                "consumer_secret": "invalid",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(WooCommerceConnection.objects.filter(user=self.user).exists())


