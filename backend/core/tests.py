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
        self.assertTrue(sample['cta_url'].startswith('https://'))
        self.assertEqual(sample['status'], 'live')
