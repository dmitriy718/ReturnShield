from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.db.models import Count, Sum, F, Q
from returns.models import ReturnRequest, Order
from datetime import timedelta
from django.utils import timezone

class ReturnReasonAnalyticsView(APIView):
    """
    Aggregates return reasons by SKU/Product.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # For MVP, we'll iterate in Python since items are in JSONField
        # In production, this should be normalized or using Postgres JSONB queries
        
        analytics = {} # { sku: { reason: count } }
        
        returns = ReturnRequest.objects.all().select_related('order')
        
        for ret in returns:
            # Parse reason (remove resolution tag)
            raw_reason = ret.reason.split('[')[0].strip()
            
            for item in ret.items:
                sku = item.get('sku', 'UNKNOWN')
                if sku not in analytics:
                    analytics[sku] = {}
                
                if raw_reason not in analytics[sku]:
                    analytics[sku][raw_reason] = 0
                
                analytics[sku][raw_reason] += 1
        
        # Format for frontend: List of { sku, reasons: { reason: count } }
        response_data = []
        for sku, reasons in analytics.items():
            response_data.append({
                "sku": sku,
                "reasons": reasons,
                "total_returns": sum(reasons.values())
            })
            
        # Sort by total returns descending
        response_data.sort(key=lambda x: x['total_returns'], reverse=True)
        
        return Response(response_data, status=status.HTTP_200_OK)


class CohortAnalysisView(APIView):
    """
    Calculates return rates for New vs Returning customers.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # 1. Identify New vs Returning Customers based on Order count
        # Group orders by email
        customer_orders = {}
        orders = Order.objects.all()
        
        for order in orders:
            email = order.customer_email.lower()
            if email not in customer_orders:
                customer_orders[email] = 0
            customer_orders[email] += 1
            
        new_customers = {email for email, count in customer_orders.items() if count == 1}
        returning_customers = {email for email, count in customer_orders.items() if count > 1}
        
        # 2. Calculate Return Rate for each cohort
        # Return Rate = (Total Returns / Total Orders) * 100
        
        def calculate_metrics(emails):
            cohort_orders = orders.filter(customer_email__in=emails).count()
            if cohort_orders == 0:
                return {"return_rate": 0, "total_orders": 0, "total_returns": 0}
                
            cohort_returns = ReturnRequest.objects.filter(order__customer_email__in=emails).count()
            return {
                "return_rate": round((cohort_returns / cohort_orders) * 100, 2),
                "total_orders": cohort_orders,
                "total_returns": cohort_returns
            }
            
        new_metrics = calculate_metrics(new_customers)
        returning_metrics = calculate_metrics(returning_customers)
        
        return Response({
            "new_customers": new_metrics,
            "returning_customers": returning_metrics
        }, status=status.HTTP_200_OK)


class ProfitabilityImpactView(APIView):
    """
    Calculates margin saved via exchanges vs refunds.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Filter by resolution tag in reason string
        exchanges = ReturnRequest.objects.filter(reason__contains='[EXCHANGE]')
        refunds = ReturnRequest.objects.filter(reason__contains='[REFUND]')
        
        exchange_value = exchanges.aggregate(total=Sum('refund_amount'))['total'] or 0
        refund_value = refunds.aggregate(total=Sum('refund_amount'))['total'] or 0
        
        # "Saved Margin" is essentially the revenue retained via exchanges
        # We could also factor in the 10% bonus cost, but for "Revenue Retained" we'll just use the principal
        
        return Response({
            "revenue_retained": exchange_value,
            "revenue_refunded": refund_value,
            "exchange_count": exchanges.count(),
            "refund_count": refunds.count(),
            "retained_percentage": round((exchange_value / (exchange_value + refund_value)) * 100, 2) if (exchange_value + refund_value) > 0 else 0
        }, status=status.HTTP_200_OK)
