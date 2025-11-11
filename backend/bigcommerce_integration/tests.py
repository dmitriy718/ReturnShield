from unittest import mock

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import BigCommerceInstallation


class BigCommerceIntegrationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="bigcommerce",
            email="bigcommerce@returnshield.app",
            password="StrongPass123!",
        )
        self.client.force_authenticate(self.user)

    @mock.patch("bigcommerce_integration.views.requests.get")
    def test_connect_success(self, mock_get):
        mock_get.return_value = mock.Mock(
            status_code=200,
            json=lambda: {"data": {"name": "Demo Store", "domain": "demo.mybigcommerce.com"}},
        )

        response = self.client.post(
            reverse("bigcommerce_integration:connect"),
            {
                "store_hash": "abcd123",
                "access_token": "token",
                "client_id": "client",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        installation = BigCommerceInstallation.objects.get(user=self.user)
        self.assertTrue(installation.active)
        self.assertEqual(installation.store_hash, "abcd123")
        self.user.refresh_from_db()
        self.assertEqual(self.user.store_platform, User.StorePlatform.BIGCOMMERCE)

    @mock.patch("bigcommerce_integration.views.requests.get")
    def test_connect_failure(self, mock_get):
        mock_get.return_value = mock.Mock(status_code=401, json=lambda: {})

        response = self.client.post(
            reverse("bigcommerce_integration:connect"),
            {
                "store_hash": "invalid",
                "access_token": "wrong",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(BigCommerceInstallation.objects.filter(user=self.user).exists())


