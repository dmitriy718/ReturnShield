from django.conf import settings
from django.db import models
from django.utils import timezone


class WooCommerceConnection(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="woocommerce_connection",
    )
    site_url = models.URLField()
    consumer_key = models.CharField(max_length=255)
    consumer_secret = models.CharField(max_length=255)
    active = models.BooleanField(default=False)
    connected_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def mark_active(self) -> None:
        self.active = True
        self.connected_at = timezone.now()
        self.save(update_fields=["active", "connected_at", "updated_at"])

    def __str__(self) -> str:
        return f"{self.site_url} ({'active' if self.active else 'pending'})"


