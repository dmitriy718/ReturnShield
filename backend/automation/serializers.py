from rest_framework import serializers
from .models import AutomationRule, FraudSettings

class AutomationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomationRule
        fields = ['id', 'name', 'rule_type', 'trigger_field', 'operator', 'value', 'is_active', 'created_at']
        read_only_fields = ['created_at']

class FraudSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraudSettings
        fields = ['flag_high_velocity', 'max_return_velocity', 'flag_high_value', 'high_value_threshold']
