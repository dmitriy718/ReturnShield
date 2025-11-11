from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Primary user model for ReturnShield accounts."""

    class StorePlatform(models.TextChoices):
        NONE = "none", "Not connected"
        SHOPIFY = "shopify", "Shopify"
        BIGCOMMERCE = "bigcommerce", "BigCommerce"
        WOOCOMMERCE = "woocommerce", "WooCommerce"

    company_name = models.CharField(max_length=255, blank=True)
    has_shopify_store = models.BooleanField(
        default=False,
        help_text="Indicates if the merchant operates an active Shopify storefront.",
    )
    shopify_domain = models.CharField(
        max_length=255,
        blank=True,
        help_text="Primary Shopify storefront domain connected to ReturnShield.",
    )
    stripe_customer_id = models.CharField(max_length=255, blank=True)
    subscription_status = models.CharField(
        max_length=16,
        choices=[
            ("trial", "Trial"),
            ("launch", "Launch"),
            ("scale", "Scale"),
            ("elite", "Elite"),
        ],
        default="trial",
        help_text="Current paid subscription tier for gated feature access.",
    )
    store_platform = models.CharField(
        max_length=32,
        choices=StorePlatform.choices,
        default=StorePlatform.NONE,
        help_text="Primary ecommerce platform connected to ReturnShield.",
    )
    store_domain = models.CharField(
        max_length=255,
        blank=True,
        help_text="Primary storefront domain or URL connected to ReturnShield.",
    )

    onboarding_stage = models.CharField(
        max_length=32,
        choices=[
            ("connect", "Connect"),
            ("sync", "Sync"),
            ("insights", "See Insights"),
            ("complete", "Complete"),
        ],
        default="connect",
    )
    has_completed_walkthrough = models.BooleanField(
        default=False,
        help_text="True once the guided dashboard walkthrough has been completed.",
    )

    def __str__(self) -> str:
        name = self.get_full_name() or self.username
        company = f" @ {self.company_name}" if self.company_name else ""
        return f"{name}{company}"

    def save(self, *args, **kwargs):
        if self.store_platform == self.StorePlatform.SHOPIFY and self.store_domain:
            self.has_shopify_store = True
            self.shopify_domain = self.store_domain
        elif self.store_platform != self.StorePlatform.SHOPIFY:
            self.has_shopify_store = False
            if self.store_platform not in (self.StorePlatform.NONE, self.StorePlatform.SHOPIFY):
                self.shopify_domain = ""
        super().save(*args, **kwargs)
