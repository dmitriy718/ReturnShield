from django.contrib import admin

from .models import ShopifyInstallation


@admin.register(ShopifyInstallation)
class ShopifyInstallationAdmin(admin.ModelAdmin):
    list_display = ["shop_domain", "user", "active", "last_synced_at", "created_at"]
    search_fields = ["shop_domain", "user__username", "user__email"]
    list_filter = ["active", "created_at"]
    readonly_fields = ["created_at", "updated_at", "last_synced_at"]
