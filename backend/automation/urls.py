from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AutomationRuleViewSet, FraudSettingsView

router = DefaultRouter()
router.register(r'rules', AutomationRuleViewSet, basename='automation-rule')

urlpatterns = [
    path('', include(router.urls)),
    path('fraud-settings/', FraudSettingsView.as_view(), name='fraud-settings'),
]
