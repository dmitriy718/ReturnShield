from rest_framework import serializers


class ExchangeAutomationInputSerializer(serializers.Serializer):
    return_rate = serializers.FloatField(min_value=0, max_value=100)
    exchange_rate = serializers.FloatField(min_value=0, max_value=100)
    average_order_value = serializers.FloatField(min_value=0)
    logistic_cost_per_return = serializers.FloatField(min_value=0)
    top_return_reason = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )

