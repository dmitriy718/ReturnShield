from unittest import mock

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class AuthAPITestCase(APITestCase):
    @mock.patch("accounts.views.capture_event")
    @mock.patch("accounts.views.identify")
    @mock.patch("accounts.views.send_onboarding_email")
    def test_register_creates_user_and_token(
        self,
        mock_send_email,
        mock_identify,
        mock_capture_event,
    ):
        url = reverse("accounts:register")
        payload = {
            "username": "founder",
            "email": "founder@returnshield.app",
            "password": "StrongPass123!",
            "company_name": "ReturnShield Labs",
            "has_shopify_store": True,
            "shopify_domain": "returnshield.myshopify.com",
        }

        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.first()
        self.assertEqual(user.company_name, payload["company_name"])
        self.assertEqual(user.onboarding_stage, "connect")
        self.assertTrue(user.has_shopify_store)
        mock_send_email.assert_called_once_with(user)
        mock_identify.assert_called_once()
        mock_capture_event.assert_called_once()

    def test_login_returns_token(self):
        user = User.objects.create_user(
            username="existing",
            email="existing@returnshield.app",
            password="StrongPass123!",
        )
        url = reverse("accounts:login")
        payload = {
            "username": user.username,
            "password": "StrongPass123!",
        }

        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_register_without_shopify_store(self):
        response = self.client.post(
            reverse("accounts:register"),
            {
                "username": "founder2",
                "email": "founder2@returnshield.app",
                "password": "StrongPass123!",
                "company_name": "ReturnShield Labs",
                "has_shopify_store": False,
                "shopify_domain": "",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="founder2")
        self.assertFalse(user.has_shopify_store)
        self.assertEqual(user.shopify_domain, "")

    @mock.patch("accounts.views.capture_event")
    def test_onboarding_stage_updates_tracked(self, mock_capture_event):
        user = User.objects.create_user(
            username="stageuser",
            email="stage@returnshield.app",
            password="StrongPass123!",
        )
        self.client.force_authenticate(user)
        response = self.client.post(
            reverse("accounts:onboarding"),
            {"stage": "insights"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_capture_event.assert_called_once()

    @mock.patch("accounts.views.capture_event")
    def test_walkthrough_completion_updates_flag(self, mock_capture_event):
        user = User.objects.create_user(
            username="walkthrough",
            email="walkthrough@returnshield.app",
            password="StrongPass123!",
        )
        self.client.force_authenticate(user)
        response = self.client.post(
            reverse("accounts:walkthrough"),
            {"completed": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.has_completed_walkthrough)
        mock_capture_event.assert_called_once()
