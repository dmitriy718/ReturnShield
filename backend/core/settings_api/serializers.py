from rest_framework import serializers
from .models import CompanySettings

class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanySettings
        fields = [
            'brand_color', 'logo_url', 
            'return_window_days', 'offer_free_shipping', 'restocking_fee',
            'easypost_api_key', 'support_email',
            'bigcommerce_store_hash', 'bigcommerce_access_token',
            'woocommerce_site_url', 'woocommerce_consumer_key', 'woocommerce_consumer_secret'
        ]
        extra_kwargs = {
            'easypost_api_key': {'write_only': True},
            'bigcommerce_access_token': {'write_only': True},
            'woocommerce_consumer_secret': {'write_only': True},
        }
