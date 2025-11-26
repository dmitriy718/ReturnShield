from django.conf import settings
from django.db import models
from django.utils import timezone


class ShopifyInstallation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="shopify_installations",
    )
    shop_domain = models.CharField(max_length=255, unique=False) # unique=True removed, now part of unique_together
    access_token = models.CharField(max_length=255, blank=True)
    scope = models.TextField(blank=True) # Changed to TextField
    state = models.CharField(max_length=255, blank=True) # max_length changed, unique=True removed
    active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_synced_at = models.DateTimeField( # New field added
        null=True,
        blank=True,
        help_text="Last successful order sync timestamp"
    )

    class Meta:
        unique_together = [["user", "shop_domain"]] # Changed from ordering
        ordering = ("-created_at",) # Kept ordering as it's a good practice

    def mark_installed(self, access_token: str, scope: str) -> None: # Removed *, installed_at logic
        self.access_token = access_token
        self.scope = scope
        self.active = True
        self.save(update_fields=["access_token", "scope", "active", "updated_at"])

    def __str__(self) -> str:
        return f"{self.shop_domain} ({'active' if self.active else 'pending'})"
```
