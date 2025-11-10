from django.conf import settings
from django.db import models
from django.utils import timezone


class ShopifyInstallation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="shopify_installations",
    )
    shop_domain = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255, blank=True)
    scope = models.CharField(max_length=512, blank=True)
    state = models.CharField(max_length=64, unique=True)
    installed_at = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def mark_installed(self, *, access_token: str, scope: str) -> None:
        self.access_token = access_token
        self.scope = scope
        self.active = True
        self.installed_at = timezone.now()
        self.save(update_fields=["access_token", "scope", "active", "installed_at", "updated_at"])

    def __str__(self) -> str:
        return f"{self.shop_domain} ({'active' if self.active else 'pending'})"
