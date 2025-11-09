from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Primary user model for ReturnShield accounts."""

    company_name = models.CharField(max_length=255, blank=True)
    shopify_domain = models.CharField(
        max_length=255,
        blank=True,
        help_text="Primary Shopify storefront domain connected to ReturnShield.",
    )
    stripe_customer_id = models.CharField(max_length=255, blank=True)

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

    def __str__(self) -> str:
        name = self.get_full_name() or self.username
        company = f" @ {self.company_name}" if self.company_name else ""
        return f"{name}{company}"
