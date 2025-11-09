from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class ReturnShieldUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "ReturnShield Profile",
            {
                "fields": (
                    "company_name",
                    "shopify_domain",
                    "stripe_customer_id",
                    "onboarding_stage",
                )
            },
        ),
    )

    list_display = (
        "username",
        "email",
        "company_name",
        "shopify_domain",
        "onboarding_stage",
        "is_staff",
    )
    list_filter = UserAdmin.list_filter + ("onboarding_stage",)
    search_fields = UserAdmin.search_fields + ("company_name", "shopify_domain")
