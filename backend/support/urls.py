from django.urls import path

from .views import SupportMessageView

app_name = "support"

urlpatterns = [
    path("messages/", SupportMessageView.as_view(), name="support-message"),
]

