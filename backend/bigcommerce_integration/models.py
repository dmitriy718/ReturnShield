from django.conf import settings
from django.db import models
from django.utils import timezone


class BigCommerceInstallation(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bigcommerce_installation",
    )
    store_hash = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255)
    client_id = models.CharField(max_length=255, blank=True)
    context = models.CharField(max_length=255, blank=True)
    active = models.BooleanField(default=False)
    connected_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def mark_active(self, *, client_id: str, access_token: str, context: str = "") -> None:
        self.client_id = client_id
        self.access_token = access_token
        self.context = context
        self.active = True
        self.connected_at = timezone.now()
        self.save(
            update_fields=[
                "client_id",
                "access_token",
                "context",
                "active",
                "connected_at",
                "updated_at",
            ]
        )

    def __str__(self) -> str:
        return f"{self.store_hash} ({'active' if self.active else 'pending'})"


