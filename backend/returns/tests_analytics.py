from django.utils import timezone

from django.test import TestCase
from django.contrib.auth import get_user_model
from returns.models import Order, ReturnRequest
from returns.utils import build_returnless_insights, build_exchange_coach_actions
from decimal import Decimal

User = get_user_model()

class AnalyticsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        
        # Create an Order
        self.order = Order.objects.create(
            user=self.user,
            external_id='1001',
            platform='shopify',
            customer_email='customer@example.com',
            total=Decimal('100.00'),
            created_at=timezone.now(),
            line_items=[
                {
                    'id': 'li_1',
                    'sku': 'TEST-SKU-1',
                    'name': 'Test Product',
                    'price': '50.00',
                    'quantity': 2
                }
            ]
        )
        
        # Create a ReturnRequest (simulating a synced refund)
        self.return_request = ReturnRequest.objects.create(
            order=self.order,
            user=self.user,
            status='completed',
            shopify_refund_id='ref_1',
            refund_amount=Decimal('50.00'),
            items=[
                {
                    'line_item_id': 'li_1',
                    'quantity': 1
                }
            ],
            reason='Size too small'
        )

    def test_returnless_insights(self):
        insights = build_returnless_insights()
        
        # Check summary
        self.assertEqual(insights['summary']['annualized_margin_recovery'], 600) # 50 * 12
        
        # Check candidates
        candidates = insights['candidates']
        self.assertEqual(len(candidates), 1)
        self.assertEqual(candidates[0]['sku'], 'TEST-SKU-1')
        self.assertEqual(candidates[0]['return_volume_30d'], 1)
        self.assertEqual(candidates[0]['estimated_margin_recaptured'], 50.0)

    def test_exchange_coach(self):
        coach = build_exchange_coach_actions()
        
        actions = coach['actions']
        # Should have PORTFOLIO + 1 SKU action
        self.assertEqual(len(actions), 2)
        
        sku_action = actions[1]
        self.assertEqual(sku_action['sku'], 'TEST-SKU-1')
        self.assertIn('Convert Test Product', sku_action['headline'])
