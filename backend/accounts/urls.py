from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .views import MeView, OnboardingProgressView, RegisterView, StoreProfileView, WalkthroughCompletionView

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", obtain_auth_token, name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("onboarding/", OnboardingProgressView.as_view(), name="onboarding"),
    path("walkthrough/", WalkthroughCompletionView.as_view(), name="walkthrough"),
    path("store/", StoreProfileView.as_view(), name="store-profile"),
]

