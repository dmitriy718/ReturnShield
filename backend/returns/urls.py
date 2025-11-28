from django.urls import path

from .views import ExchangeAutomationView, ExchangeCoachView, ReturnlessInsightsView, VIPResolutionView, ShopperOrderLookupView, ShopperReturnSubmitView
from analytics.views import ReturnReasonAnalyticsView, CohortAnalysisView, ProfitabilityImpactView

app_name = "returns"

urlpatterns = [
    path("exchange-playbook/", ExchangeAutomationView.as_view(), name="exchange-playbook"),
    path(
        "returnless-insights/",
        ReturnlessInsightsView.as_view(),
        name="returnless-insights",
    ),
    path(
        "exchange-coach/",
        ExchangeCoachView.as_view(),
        name="exchange-coach",
    ),
    path(
        "vip-resolution/",
        VIPResolutionView.as_view(),
        name="vip-resolution",
    ),
    path(
        "lookup/",
        ShopperOrderLookupView.as_view(),
        name="order-lookup",
    ),
    path(
        "submit/",
        ShopperReturnSubmitView.as_view(),
        name="return-submit",
    ),
    # Analytics
    path("analytics/reasons/", ReturnReasonAnalyticsView.as_view(), name="analytics-reasons"),
    path("analytics/cohorts/", CohortAnalysisView.as_view(), name="analytics-cohorts"),
    path("analytics/profitability/", ProfitabilityImpactView.as_view(), name="analytics-profitability"),
]

