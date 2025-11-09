from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class AuthAPITestCase(APITestCase):
    def test_register_creates_user_and_token(self):
        url = reverse("accounts:register")
        payload = {
            "username": "founder",
            "email": "founder@returnshield.app",
            "password": "StrongPass123!",
            "company_name": "ReturnShield Labs",
            "shopify_domain": "returnshield.myshopify.com",
        }

        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.first()
        self.assertEqual(user.company_name, payload["company_name"])
        self.assertEqual(user.onboarding_stage, "sync")

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
from django.test import TestCase

# Create your tests here.
