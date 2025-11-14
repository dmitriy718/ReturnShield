from __future__ import annotations

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class PlatformStatusViewTests(APITestCase):
    def test_platform_status_returns_expected_payload(self) -> None:
        url = reverse('platform-status')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertIn('platforms', body)
        self.assertGreaterEqual(len(body['platforms']), 3)

        slugs = {entry['slug'] for entry in body['platforms']}
        self.assertIn('shopify', slugs)
        self.assertIn('bigcommerce', slugs)
        self.assertIn('woocommerce', slugs)

        sample = next(item for item in body['platforms'] if item['slug'] == 'shopify')
        self.assertIn('cta_url', sample)
        self.assertIn('platform=shopify', sample['cta_url'])
        self.assertEqual(sample['status'], 'live')


class HealthCheckViewTests(APITestCase):
    def test_health_check_reports_database_status(self) -> None:
        url = reverse('health-check')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()
        self.assertEqual(body['status'], 'ok')
        self.assertIn('checks', body)
        self.assertIn('database', body['checks'])
        self.assertTrue(body['checks']['database']['healthy'])
        self.assertIn('latency_ms', body['checks']['database'])
