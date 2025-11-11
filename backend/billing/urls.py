from django.urls import path

from .views import ActivateSubscriptionView, CreateCheckoutSessionView

app_name = "billing"

urlpatterns = [
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("activate/", ActivateSubscriptionView.as_view(), name="activate"),
]
