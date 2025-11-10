from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from returns.utils import build_exchange_playbook, build_returnless_insights

User = get_user_model()


class ExchangePlaybookTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="policy",
            email="policy@returnshield.app",
            password="StrongPass123!",
        )

    def test_build_exchange_playbook_generates_recos(self):
        result = build_exchange_playbook(
            return_rate=25,
            exchange_rate=5,
            average_order_value=120,
            logistic_cost_per_return=40,
            top_return_reason="Size too small",
        )
        self.assertGreaterEqual(len(result["recommendations"]), 1)

    def test_endpoint_requires_auth(self):
        response = self.client.post(
            reverse("returns:exchange-playbook"),
            {
                "return_rate": 20,
                "exchange_rate": 5,
                "average_order_value": 90,
                "logistic_cost_per_return": 30,
            },
            format="json",
        )
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_endpoint_returns_playbook(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            reverse("returns:exchange-playbook"),
            {
                "return_rate": 22,
                "exchange_rate": 4,
                "average_order_value": 110,
                "logistic_cost_per_return": 35,
                "top_return_reason": "Size mismatch",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("recommendations", data)
        self.assertGreater(len(data["recommendations"]), 0)


class ReturnlessInsightsTests(APITestCase):
    def test_build_returnless_insights_summary(self):
        insights = build_returnless_insights()
        self.assertIn("summary", insights)
        self.assertGreaterEqual(insights["summary"]["annualized_margin_recovery"], 0)
        self.assertEqual(len(insights["candidates"]), 3)

    def test_returnless_endpoint_returns_payload(self):
        response = self.client.get(reverse("returns:returnless-insights"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        self.assertIn("summary", payload)
        self.assertIn("candidates", payload)
        self.assertGreater(len(payload["candidates"]), 0)


class ExchangeCoachTests(APITestCase):
    def test_exchange_coach_endpoint(self):
        response = self.client.get(reverse("returns:exchange-coach"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("recommendations", data)
        self.assertGreaterEqual(len(data["recommendations"]), 1)
        first = data["recommendations"][0]
        self.assertIn("title", first)
        self.assertIn("automation_actions", first)


class VIPResolutionTests(APITestCase):
    def test_vip_queue_endpoint(self):
        response = self.client.get(reverse("returns:vip-resolution"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        self.assertIn("queue", payload)
        self.assertGreater(len(payload["queue"]), 0)
        entry = payload["queue"][0]
        self.assertIn("customer", entry)
        self.assertIn("recommended_action", entry)
