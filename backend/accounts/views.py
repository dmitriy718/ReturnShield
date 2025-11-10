import logging

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.posthog import capture as capture_event, identify
from notifications.email import send_onboarding_email

from .serializers import RegisterSerializer, UserSerializer

logger = logging.getLogger(__name__)


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(pk=response.data["id"])
        token, _created = Token.objects.get_or_create(user=user)
        response.data["token"] = token.key
        try:
            send_onboarding_email(user)
        except Exception:  # pragma: no cover
            logger.exception("Failed to send onboarding email for user %s", user.pk)
        try:
            identify(
                str(user.pk),
                {
                    "email": user.email,
                    "company_name": user.company_name,
                    "onboarding_stage": user.onboarding_stage,
                },
            )
            capture_event(
                "user_signed_up",
                distinct_id=str(user.pk),
                properties={
                    "company_name": user.company_name,
                    "shopify_domain": user.shopify_domain,
                },
            )
        except Exception:  # pragma: no cover
            logger.exception("Failed to notify PostHog for user %s", user.pk)
        return response


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class OnboardingProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        stage = request.data.get("stage")
        if stage not in {"connect", "sync", "insights", "complete"}:
            return Response(
                {"detail": "Invalid stage"},
                status=400,
            )
        user = request.user
        user.onboarding_stage = stage
        user.save(update_fields=["onboarding_stage"])
        try:
            capture_event(
                "onboarding_stage_updated",
                distinct_id=str(user.pk),
                properties={"stage": stage},
            )
        except Exception:  # pragma: no cover
            logger.exception("Failed to record onboarding stage for user %s", user.pk)
        return Response({"status": "updated", "onboarding_stage": stage})
