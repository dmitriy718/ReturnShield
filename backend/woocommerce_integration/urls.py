from django.urls import path

from .views import WooCommerceConnectView, WooCommerceStatusView

app_name = "woocommerce_integration"

urlpatterns = [
    path("connect/", WooCommerceConnectView.as_view(), name="connect"),
    path("status/", WooCommerceStatusView.as_view(), name="status"),
]


