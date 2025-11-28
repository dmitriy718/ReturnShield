from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from .models import AutomationRule, FraudSettings
from returns.models import ReturnRequest

class RuleEvaluator:
    @staticmethod
    def evaluate(return_request: ReturnRequest):
        """
        Evaluates active automation rules against the return request.
        Returns the first matching rule, or None.
        """
        # Get rules for the merchant
        rules = AutomationRule.objects.filter(
            user=return_request.order.user,
            is_active=True
        )

        for rule in rules:
            if RuleEvaluator._check_rule(rule, return_request):
                return rule
        return None

    @staticmethod
    def _check_rule(rule: AutomationRule, request: ReturnRequest) -> bool:
        # Get the actual value from the request based on trigger field
        actual_value = None
        
        if rule.trigger_field == AutomationRule.TriggerField.TOTAL_VALUE:
            # Calculate total value of items being returned
            actual_value = sum(item.price * item.quantity for item in request.items.all())
        elif rule.trigger_field == AutomationRule.TriggerField.RETURN_REASON:
            actual_value = request.reason
        elif rule.trigger_field == AutomationRule.TriggerField.ITEM_CONDITION:
            # Assuming condition is uniform or checking if ANY item matches
            # For simplicity, let's check the first item's condition if available
            # Or we might need to extend the model to support item-level checks
            # For now, let's skip complex item condition checks or assume it's passed in metadata
            pass

        if actual_value is None:
            return False

        # Compare based on operator
        target_value = rule.value

        try:
            if rule.trigger_field == AutomationRule.TriggerField.TOTAL_VALUE:
                actual_dec = Decimal(str(actual_value))
                target_dec = Decimal(str(target_value))
                
                if rule.operator == AutomationRule.Operator.EQUALS:
                    return actual_dec == target_dec
                elif rule.operator == AutomationRule.Operator.GREATER_THAN:
                    return actual_dec > target_dec
                elif rule.operator == AutomationRule.Operator.LESS_THAN:
                    return actual_dec < target_dec
            
            else: # String comparison
                actual_str = str(actual_value).lower()
                target_str = str(target_value).lower()

                if rule.operator == AutomationRule.Operator.EQUALS:
                    return actual_str == target_str
                elif rule.operator == AutomationRule.Operator.CONTAINS:
                    return target_str in actual_str
        except Exception:
            return False
            
        return False

class FraudDetector:
    @staticmethod
    def check_fraud(return_request: ReturnRequest) -> tuple[bool, str]:
        """
        Checks if the return request is fraudulent based on merchant settings.
        Returns (is_fraud, reason).
        """
        user = return_request.order.user
        try:
            settings = user.fraud_settings
        except FraudSettings.DoesNotExist:
            return False, ""

        # 1. Check Velocity
        if settings.flag_high_velocity:
            month_ago = timezone.now() - timedelta(days=30)
            # Count returns from this customer email in the last 30 days
            # We use the order's customer email
            customer_email = return_request.order.customer_email
            
            recent_returns_count = ReturnRequest.objects.filter(
                order__user=user,
                order__customer_email=customer_email,
                created_at__gte=month_ago
            ).exclude(id=return_request.id).count()

            if recent_returns_count >= settings.max_return_velocity:
                return True, f"High return velocity: {recent_returns_count} returns in last 30 days."

        # 2. Check High Value
        if settings.flag_high_value:
            total_value = sum(item.price * item.quantity for item in return_request.items.all())
            if total_value >= settings.high_value_threshold:
                return True, f"High value return: ${total_value} exceeds threshold of ${settings.high_value_threshold}."

        return False, ""
