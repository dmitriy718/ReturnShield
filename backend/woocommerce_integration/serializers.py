from rest_framework import serializers


class WooCommerceConnectSerializer(serializers.Serializer):
    site_url = serializers.URLField()
    consumer_key = serializers.CharField(max_length=255)
    consumer_secret = serializers.CharField(max_length=255)

    def validate_site_url(self, value: str) -> str:
        return value.rstrip("/")


