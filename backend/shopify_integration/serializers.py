from rest_framework import serializers

from .utils import ensure_myshopify_domain


class InstallRequestSerializer(serializers.Serializer):
    shop_domain = serializers.CharField(max_length=255)

    def validate_shop_domain(self, value: str) -> str:
        domain = ensure_myshopify_domain(value)
        if not domain.endswith(".myshopify.com"):
            raise serializers.ValidationError("Invalid Shopify domain.")
        return domain

