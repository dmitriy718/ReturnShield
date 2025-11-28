import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import permissions
from rest_framework.throttling import AnonRateThrottle
from django.shortcuts import get_object_or_404

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
    Requires 'order_number' and 'email' OR 'zip_code' (for gift returns).
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    throttle_scope = 'shopper_lookup'

    def post(self, request, *args, **kwargs):
        order_number = request.data.get("order_number")
        email = request.data.get("email")
        zip_code = request.data.get("zip_code")
        is_gift = request.data.get("is_gift", False)

        if not order_number:
            return Response(
                {"error": "Please provide an order number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        from .models import Order
        
        if is_gift and zip_code:
            # Gift Return Lookup: Match Order Number + Zip Code
            # We need to check the shipping_address JSON field
            # This is a bit complex with JSONField, but for MVP we can filter in Python or use exact match if schema is consistent
            # Assuming shipping_address has a 'zip' key
            
            # First find by order number
            orders = Order.objects.filter(external_id=str(order_number))
            
            matched_order = None
            for order in orders:
                shipping_zip = order.shipping_address.get('zip', '')
                # Simple loose match
                if str(zip_code).strip() in str(shipping_zip):
                    matched_order = order
                    break
            
            if not matched_order:
                 return Response(
                    {"error": "Order not found with that Zip Code."},
                    status=status.HTTP_404_NOT_FOUND
                )
            order = matched_order

        elif email:
            # Standard Lookup: Match Order Number + Email
            order = Order.objects.filter(
                external_id=str(order_number),
                customer_email__iexact=email
            ).first()
            
            if not order:
                return Response(
                    {"error": "Order not found with that Email."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
             return Response(
                {"error": "Please provide Email or Zip Code (for gifts)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Build response
        return Response({
            "id": order.id,
            "order_number": order.external_id,
            "created_at": order.created_at,
            "currency": order.currency,
            "items": order.line_items,
            "is_gift_lookup": is_gift
        }, status=status.HTTP_200_OK)


class ShopperReturnSubmitView(APIView):
    """
    Public endpoint for shoppers to submit a return.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]
    throttle_scope = 'shopper_submit'

    def post(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")
        items = request.data.get("items") # List of line_item_ids
        reason = request.data.get("reason")
        resolution = request.data.get("resolution") # 'exchange' or 'refund'
        
        # Gift Return Fields
        is_gift = request.data.get("is_gift", False)
        recipient_email = request.data.get("recipient_email")

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
        if is_gift:
            full_reason += " [GIFT RETURN]"

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
            refund_amount=refund_amount,
            is_gift=is_gift,
            recipient_email=recipient_email
        )

        # Generate Shipping Label
        from .shipping import generate_return_label
        label_data = generate_return_label(return_request)
        
        if label_data["label_url"]:
            return_request.shipping_label_url = label_data["label_url"]
            return_request.tracking_number = label_data["tracking_number"]
            return_request.save()

        # --- Automation & Fraud Detection ---
        from automation.services import RuleEvaluator, FraudDetector
        from automation.models import AutomationRule

        # 1. Check Fraud
        is_fraud, fraud_reason = FraudDetector.check_fraud(return_request)
        if is_fraud:
            return_request.is_flagged_fraud = True
            return_request.fraud_reason = fraud_reason
            return_request.save()
            # We might still allow label generation but flag it for review
            # Or we could block it. For MVP, we flag it.

        # 2. Check Automation Rules (only if not fraud)
        if not is_fraud:
            matched_rule = RuleEvaluator.evaluate(return_request)
            if matched_rule:
                return_request.automation_rule_applied = matched_rule
                if matched_rule.rule_type == AutomationRule.RuleType.APPROVE:
                    return_request.status = 'approved'
                elif matched_rule.rule_type == AutomationRule.RuleType.REJECT:
                    return_request.status = 'rejected'
                # FLAG is default 'pending' essentially
                return_request.save()



        return Response({
            "id": return_request.id,
            "status": return_request.status,
            "message": "Return submitted successfully",
            "label_url": return_request.shipping_label_url
        }, status=status.HTTP_201_CREATED)
