from django.conf import settings
from django.db import models


class Order(models.Model):
    """Synced order data from e-commerce platforms."""

    PLATFORM_CHOICES = [
        ('shopify', 'Shopify'),
        ('bigcommerce', 'BigCommerce'),
        ('woocommerce', 'WooCommerce'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    external_id = models.CharField(max_length=255, help_text="Platform-specific order ID")
    platform = models.CharField(max_length=32, choices=PLATFORM_CHOICES)

    # Order details
    customer_email = models.EmailField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')

    # Timestamps
    created_at = models.DateTimeField(help_text="Order creation time on platform")
    synced_at = models.DateTimeField(auto_now=True)

    # Data storage
    line_items = models.JSONField(default=list, help_text="Order line items")
    shipping_address = models.JSONField(default=dict)
    raw_data = models.JSONField(default=dict, help_text="Full platform response")

    class Meta:
        unique_together = [['external_id', 'platform', 'user']]
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['platform', 'external_id']),
        ]

    def __str__(self):
        return f"Order {self.external_id} ({self.platform})"


class ReturnRequest(models.Model):
    """Customer return requests."""

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='returns')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Return details
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Sync details
    shopify_refund_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    restock = models.BooleanField(default=False)

    # Gift Returns
    is_gift = models.BooleanField(default=False)
    recipient_email = models.EmailField(blank=True, null=True)

    # Fraud & Automation
    is_flagged_fraud = models.BooleanField(default=False)
    fraud_reason = models.TextField(blank=True, null=True)
    automation_rule_applied = models.ForeignKey(
        'automation.AutomationRule',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applied_returns'
    )

    # Shipping
    shipping_label_url = models.URLField(blank=True, null=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)

    # Items being returned
    items = models.JSONField(default=list, help_text="List of items being returned")

    class Meta:
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Return for Order {self.order.external_id}"
