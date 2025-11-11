from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "company_name",
            "has_shopify_store",
            "shopify_domain",
            "stripe_customer_id",
            "onboarding_stage",
            "subscription_status",
            "has_completed_walkthrough",
        )
        read_only_fields = (
            "id",
            "stripe_customer_id",
            "onboarding_stage",
            "subscription_status",
            "has_completed_walkthrough",
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    has_shopify_store = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
            "company_name",
            "has_shopify_store",
            "shopify_domain",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        has_shopify_store = attrs.get("has_shopify_store", False)
        shopify_domain = attrs.get("shopify_domain", "")
        if has_shopify_store and not shopify_domain:
            raise serializers.ValidationError(
                {"shopify_domain": "Please provide your Shopify domain to continue."}
            )
        if shopify_domain and not has_shopify_store:
            raise serializers.ValidationError(
                {
                    "has_shopify_store": (
                        "Set this to true if you supply a Shopify domain."
                    )
                }
            )
        return attrs

    def validate_password(self, value: str) -> str:
        validate_password(value, self.instance)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.onboarding_stage = "connect"
        user.save()
        return user

