from django.db import models
from django.conf import settings

class CompanySettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='settings')
    
    # Brand
    brand_color = models.CharField(max_length=20, default="#000000")
    logo_url = models.URLField(blank=True, null=True)
    
    # Return Policy
    return_window_days = models.IntegerField(default=30)
    offer_free_shipping = models.BooleanField(default=True)
    restocking_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    
    # Shipping Credentials (encrypted in a real app, plaintext for MVP)
    # We will assume users provide their own EasyPost key if they want custom rates
    easypost_api_key = models.CharField(max_length=255, blank=True, help_text="Optional: Your EasyPost API key for custom rates")
    
    # Email
    support_email = models.EmailField(blank=True)
    
    # Integrations
    bigcommerce_store_hash = models.CharField(max_length=255, blank=True)
    bigcommerce_access_token = models.CharField(max_length=255, blank=True)
    
    woocommerce_site_url = models.URLField(blank=True)
    woocommerce_consumer_key = models.CharField(max_length=255, blank=True)
    woocommerce_consumer_secret = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Settings for {self.user.company_name}"
