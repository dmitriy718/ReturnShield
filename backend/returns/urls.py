from django.urls import path

from .views import ExchangeAutomationView

app_name = "returns"

urlpatterns = [
    path("exchange-playbook/", ExchangeAutomationView.as_view(), name="exchange-playbook"),
]

