from django.contrib import admin

from .models import ShopifyInstallation


@admin.register(ShopifyInstallation)
class ShopifyInstallationAdmin(admin.ModelAdmin):
    list_display = (
        "shop_domain",
        "user",
        "active",
        "installed_at",
        "created_at",
    )
    search_fields = ("shop_domain", "user__email", "user__username")
    list_filter = ("active",)
