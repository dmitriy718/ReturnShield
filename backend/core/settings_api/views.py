from rest_framework import generics, permissions
from .models import CompanySettings
from .serializers import CompanySettingsSerializer

class CompanySettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanySettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = CompanySettings.objects.get_or_create(user=self.request.user)
        return obj
