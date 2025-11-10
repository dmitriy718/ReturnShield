from django.urls import path

from .views import CreateCheckoutSessionView

app_name = "billing"

urlpatterns = [
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
]
