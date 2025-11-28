from rest_framework import viewsets, generics, permissions
from .models import AutomationRule, FraudSettings
from .serializers import AutomationRuleSerializer, FraudSettingsSerializer

class AutomationRuleViewSet(viewsets.ModelViewSet):
    serializer_class = AutomationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AutomationRule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FraudSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = FraudSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = FraudSettings.objects.get_or_create(user=self.request.user)
        return obj
