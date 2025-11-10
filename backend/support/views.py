from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SupportMessageSerializer
from .services import HelpScoutClient


class HelpScoutConfiguredMixin:
    def ensure_configured(self) -> None:
        if not (
            settings.HELPSCOUT_APP_ID
            and settings.HELPSCOUT_APP_SECRET
            and settings.HELPSCOUT_MAILBOX_ID
        ):
            raise ValueError("HelpScout credentials are not configured.")


class SupportMessageView(APIView, HelpScoutConfiguredMixin):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SupportMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            self.ensure_configured()
        except ValueError:
            return Response(
                {"detail": "HelpScout integration is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        client = HelpScoutClient()
        response_payload = client.create_conversation(
            subject=data["subject"],
            body=data["message"],
            customer_email=data["customer_email"],
            customer_first_name=data.get("customer_first_name"),
            customer_last_name=data.get("customer_last_name"),
            tags=data.get("tags"),
            metadata={"source": "ReturnShield Dashboard"},
        )

        return Response(
            {
                "status": "submitted",
                "conversationId": response_payload.get("id"),
                "mailboxId": response_payload.get("mailboxId"),
            },
            status=status.HTTP_201_CREATED,
        )
