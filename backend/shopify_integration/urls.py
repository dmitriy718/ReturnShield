from django.urls import path

from .views import ShopifyCallbackView, ShopifyInstallUrlView

app_name = "shopify_integration"

urlpatterns = [
    path("install-url/", ShopifyInstallUrlView.as_view(), name="install-url"),
    path("callback/", ShopifyCallbackView.as_view(), name="callback"),
]

