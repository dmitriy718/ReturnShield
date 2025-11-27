import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.posthog import capture as capture_event

from .serializers import ExchangeAutomationInputSerializer
from .utils import (
    build_exchange_coach_actions,
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
        payload = build_exchange_coach_actions()
        capture_event(
            "exchange_coach_viewed",
            distinct_id="public-web",
            properties={"recommendation_count": len(payload.get("actions", []))},
        )
        return Response(payload, status=status.HTTP_200_OK)


class VIPResolutionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        queue = build_vip_resolution_queue()
        capture_event(
            "vip_resolution_viewed",
            distinct_id="public-web",
            properties={"items": len(queue.get("queue", []))},
        )
        return Response(queue, status=status.HTTP_200_OK)


class ShopperOrderLookupView(APIView):
    """
    Public endpoint for shoppers to look up their order.
    Requires 'order_number' and 'email'.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        order_number = request.data.get("order_number")
        email = request.data.get("email")

        if not order_number or not email:
            return Response(
                {"error": "Please provide both order number and email."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Try to find the order
        # Note: external_id is usually the ID, but for this MVP we might need to match 'name' or 'order_number'
        # depending on how Shopify syncs. Assuming external_id matches the user input for now.
        from .models import Order
        order = Order.objects.filter(
            external_id=str(order_number),
            customer_email__iexact=email
        ).first()

        if not order:
            return Response(
                {"error": "Order not found. Please check your details."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Build response
        return Response({
            "id": order.id,
            "order_number": order.external_id,
            "created_at": order.created_at,
            "currency": order.currency,
            "items": order.line_items,  # Assuming this is already a list of dicts
        }, status=status.HTTP_200_OK)


class ShopperReturnSubmitView(APIView):
    """
    Public endpoint for shoppers to submit a return.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")
        items = request.data.get("items") # List of line_item_ids
        reason = request.data.get("reason")
        resolution = request.data.get("resolution") # 'exchange' or 'refund'

        if not all([order_id, items, reason, resolution]):
            return Response(
                {"error": "Missing required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        from .models import Order, ReturnRequest
        
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Append resolution to reason for MVP tracking
        full_reason = f"{reason} [{resolution.upper()}]"

        # Calculate estimated refund (simple sum of item prices for MVP)
        # In a real app, we'd look up exact line item prices from the order
        refund_amount = 0
        return_items = []
        
        # Simple lookup in order.line_items
        for item_id in items:
            found_item = next((i for i in order.line_items if str(i.get('line_item_id')) == str(item_id)), None)
            if found_item:
                refund_amount += float(found_item.get('price', 0))
                return_items.append(found_item)

        # Create the return request
        return_request = ReturnRequest.objects.create(
            order=order,
            user=order.user, # Associate with the order's user (merchant's customer record)
            reason=full_reason,
            status='pending',
            items=return_items,
            refund_amount=refund_amount
        )

        return Response({
            "id": return_request.id,
            "status": return_request.status,
            "message": "Return submitted successfully"
        }, status=status.HTTP_201_CREATED)
