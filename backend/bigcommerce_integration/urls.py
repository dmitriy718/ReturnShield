from django.urls import path

from .views import BigCommerceConnectView, BigCommerceStatusView

app_name = "bigcommerce_integration"

urlpatterns = [
    path("connect/", BigCommerceConnectView.as_view(), name="connect"),
    path("status/", BigCommerceStatusView.as_view(), name="status"),
]


