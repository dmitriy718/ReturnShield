from rest_framework import serializers


class BigCommerceConnectSerializer(serializers.Serializer):
    store_hash = serializers.CharField(max_length=255)
    access_token = serializers.CharField(max_length=255)
    client_id = serializers.CharField(max_length=255, allow_blank=True, required=False)

    def validate_store_hash(self, value: str) -> str:
        return value.strip()


