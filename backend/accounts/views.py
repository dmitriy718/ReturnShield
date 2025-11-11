import logging

from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.posthog import capture as capture_event, identify
from notifications.email import send_onboarding_email

from .serializers import RegisterSerializer, StoreProfileSerializer, UserSerializer

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
                    "has_shopify_store": user.has_shopify_store,
                    "subscription_status": user.subscription_status,
                    "store_platform": user.store_platform,
                    "store_domain": user.store_domain,
                },
            )
            capture_event(
                "user_signed_up",
                distinct_id=str(user.pk),
                properties={
                    "company_name": user.company_name,
                    "shopify_domain": user.shopify_domain,
                    "has_shopify_store": user.has_shopify_store,
                    "store_platform": user.store_platform,
                    "store_domain": user.store_domain,
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


class WalkthroughCompletionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        completed = bool(request.data.get("completed"))
        user = request.user
        user.has_completed_walkthrough = completed
        user.save(update_fields=["has_completed_walkthrough"])
        try:
            capture_event(
                "walkthrough_completed" if completed else "walkthrough_reset",
                distinct_id=str(user.pk),
                properties={"completed": completed},
            )
        except Exception:  # pragma: no cover
            logger.exception("Failed to record walkthrough completion for user %s", user.pk)
        return Response({"status": "updated", "has_completed_walkthrough": completed})


class StoreProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        serializer = StoreProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user
        user.store_platform = data["store_platform"]
        user.store_domain = data.get("store_domain", "")
        if user.store_platform == User.StorePlatform.SHOPIFY and user.store_domain:
            user.has_shopify_store = True
            user.shopify_domain = user.store_domain
        else:
            user.has_shopify_store = False
            if user.store_platform != User.StorePlatform.SHOPIFY:
                user.shopify_domain = ""
        user.save()
        try:
            capture_event(
                "store_profile_updated",
                distinct_id=str(user.pk),
                properties={
                    "store_platform": user.store_platform,
                    "store_domain": user.store_domain,
                },
            )
        except Exception:  # pragma: no cover
            logger.exception("Failed to record store profile update for user %s", user.pk)
        return Response(UserSerializer(user).data, status=200)
