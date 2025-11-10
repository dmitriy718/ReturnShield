from django.urls import path

from .views import ExchangeAutomationView, ReturnlessInsightsView

app_name = "returns"

urlpatterns = [
    path("exchange-playbook/", ExchangeAutomationView.as_view(), name="exchange-playbook"),
    path(
        "returnless-insights/",
        ReturnlessInsightsView.as_view(),
        name="returnless-insights",
    ),
]

