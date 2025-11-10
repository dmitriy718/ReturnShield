import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.posthog import capture as capture_event

from .serializers import ExchangeAutomationInputSerializer
from .utils import (
    build_exchange_coach,
    build_exchange_playbook,
    build_returnless_insights,
    build_vip_resolution_queue,
)

logger = logging.getLogger(__name__)


class ExchangeAutomationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ExchangeAutomationInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        playbook = build_exchange_playbook(**payload)
        capture_event(
            "exchange_playbook_requested",
            distinct_id=str(request.user.pk),
            properties={**payload},
        )
        return Response(playbook, status=status.HTTP_200_OK)


class ReturnlessInsightsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        insights = build_returnless_insights()
        capture_event(
            "returnless_insights_viewed",
            distinct_id="public-web",
            properties={
                "sku_count": len(insights.get("candidates", [])),
                "period": insights.get("summary", {}).get("period"),
            },
        )
        return Response(insights, status=status.HTTP_200_OK)


class ExchangeCoachView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        insights = build_returnless_insights()
        recommendations = build_exchange_coach(insights)
        payload = [
            {
                "title": rec.title,
                "description": rec.description,
                "expected_impact": rec.expected_impact,
                "automation_actions": rec.automation_actions,
            }
            for rec in recommendations
        ]
        capture_event(
            "exchange_coach_viewed",
            distinct_id="public-web",
            properties={"recommendation_count": len(payload)},
        )
        return Response({"recommendations": payload}, status=status.HTTP_200_OK)


class VIPResolutionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        queue = build_vip_resolution_queue()
        capture_event(
            "vip_resolution_viewed",
            distinct_id="public-web",
            properties={"items": len(queue)},
        )
        return Response({"queue": queue}, status=status.HTTP_200_OK)
