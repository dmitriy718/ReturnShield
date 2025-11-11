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
            "store_platform",
            "store_domain",
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
            "has_shopify_store",
            "shopify_domain",
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    has_shopify_store = serializers.BooleanField(write_only=True, required=False, default=False)
    store_platform = serializers.ChoiceField(
        choices=User.StorePlatform.choices,
        default=User.StorePlatform.NONE,
    )
    store_domain = serializers.CharField(required=False, allow_blank=True, max_length=255)

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
            "store_platform",
            "store_domain",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        store_platform = attrs.get("store_platform", User.StorePlatform.NONE)
        store_domain = attrs.get("store_domain", "") or attrs.get("shopify_domain", "")

        if store_platform != User.StorePlatform.NONE and not store_domain:
            raise serializers.ValidationError(
                {"store_domain": "Please provide your storefront domain or URL to continue."}
            )

        if store_platform == User.StorePlatform.SHOPIFY:
            attrs["has_shopify_store"] = True
            attrs["shopify_domain"] = store_domain
        else:
            attrs["has_shopify_store"] = False
            if store_platform != User.StorePlatform.SHOPIFY:
                attrs["shopify_domain"] = ""

        attrs["store_domain"] = store_domain
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


class StoreProfileSerializer(serializers.Serializer):
    store_platform = serializers.ChoiceField(
        choices=User.StorePlatform.choices,
        required=True,
    )
    store_domain = serializers.CharField(required=False, allow_blank=True, max_length=255)

    def validate(self, attrs):
        platform = attrs.get("store_platform", User.StorePlatform.NONE)
        domain = attrs.get("store_domain", "")
        if platform != User.StorePlatform.NONE and not domain:
            raise serializers.ValidationError(
                {"store_domain": "A storefront domain or URL is required for the selected platform."}
            )
        if platform == User.StorePlatform.SHOPIFY and domain and not domain.endswith(".myshopify.com"):
            raise serializers.ValidationError(
                {"store_domain": "Shopify domains must end with .myshopify.com."}
            )
        attrs["store_domain"] = domain
        return attrs

