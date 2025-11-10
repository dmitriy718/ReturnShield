from rest_framework import serializers


class SupportMessageSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()
    customer_email = serializers.EmailField()
    customer_first_name = serializers.CharField(max_length=120, required=False, allow_blank=True)
    customer_last_name = serializers.CharField(max_length=120, required=False, allow_blank=True)
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        allow_empty=True,
    )

    def validate_tags(self, value):
        return [tag.strip() for tag in value if tag.strip()]

