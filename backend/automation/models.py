from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class AutomationRule(models.Model):
    class RuleType(models.TextChoices):
        APPROVE = 'APPROVE', _('Auto-Approve')
        REJECT = 'REJECT', _('Auto-Reject')
        FLAG = 'FLAG', _('Flag for Review')

    class TriggerField(models.TextChoices):
        TOTAL_VALUE = 'TOTAL_VALUE', _('Total Return Value')
        RETURN_REASON = 'RETURN_REASON', _('Return Reason')
        ITEM_CONDITION = 'ITEM_CONDITION', _('Item Condition')

    class Operator(models.TextChoices):
        EQUALS = 'eq', _('Equals')
        GREATER_THAN = 'gt', _('Greater Than')
        LESS_THAN = 'lt', _('Less Than')
        CONTAINS = 'contains', _('Contains')

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='automation_rules')
    name = models.CharField(max_length=255)
    rule_type = models.CharField(max_length=20, choices=RuleType.choices, default=RuleType.FLAG)
    trigger_field = models.CharField(max_length=50, choices=TriggerField.choices)
    operator = models.CharField(max_length=20, choices=Operator.choices)
    value = models.CharField(max_length=255, help_text="Value to compare against (e.g., '100' for $100, or 'Damaged' for reason)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_rule_type_display()})"

class FraudSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='fraud_settings')
    flag_high_velocity = models.BooleanField(default=True, help_text="Flag if customer returns too frequently")
    max_return_velocity = models.IntegerField(default=3, help_text="Max returns allowed per month before flagging")
    flag_high_value = models.BooleanField(default=True, help_text="Flag returns above a certain value")
    high_value_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Fraud Settings for {self.user}"
