from __future__ import annotations

import logging
from typing import Any, Dict

import requests
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from .models import BigCommerceInstallation
from .serializers import BigCommerceConnectSerializer

logger = logging.getLogger(__name__)


class BigCommerceConnectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = BigCommerceConnectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        store_hash = data["store_hash"]
        access_token = data["access_token"]
        client_id = data.get("client_id", "")

        headers = {
            "X-Auth-Token": access_token,
            "Accept": "application/json",
        }
        if client_id:
            headers["X-Auth-Client"] = client_id

        try:
            response = requests.get(
                f"https://api.bigcommerce.com/stores/{store_hash}/v3/store",
                headers=headers,
                timeout=10,
            )
        except requests.RequestException as exc:
            logger.exception("BigCommerce verification failed: %s", exc)
            return Response(
                {"detail": "Unable to reach BigCommerce. Please verify credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if response.status_code != 200:
            return Response(
                {"detail": "BigCommerce credentials could not be verified."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload: Dict[str, Any] = {}
        try:
            payload = response.json().get("data", {})
        except ValueError:
            logger.warning("Unexpected BigCommerce response payload.")

        installation, _created = BigCommerceInstallation.objects.get_or_create(
            user=request.user,
            defaults={
                "store_hash": store_hash,
                "access_token": access_token,
                "client_id": client_id,
                "context": payload.get("context", ""),
                "active": True,
                "connected_at": timezone.now(),
            },
        )

        if not _created:
            installation.store_hash = store_hash
            installation.mark_active(
                client_id=client_id,
                access_token=access_token,
                context=payload.get("context", ""),
            )

        self._update_user_store_profile(request.user, payload)

        return Response(
            {
                "status": "connected",
                "store_hash": store_hash,
                "store_name": payload.get("name"),
                "domain": payload.get("domain"),
            },
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def _update_user_store_profile(user: User, payload: Dict[str, Any]) -> None:
        domain = payload.get("domain") or payload.get("secure_url") or ""
        user.store_platform = User.StorePlatform.BIGCOMMERCE
        user.store_domain = domain
        user.save(update_fields=["store_platform", "store_domain", "has_shopify_store", "shopify_domain"])


class BigCommerceStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            installation = request.user.bigcommerce_installation
        except BigCommerceInstallation.DoesNotExist:
            return Response({"connected": False}, status=status.HTTP_200_OK)

        return Response(
            {
                "connected": installation.active,
                "store_hash": installation.store_hash,
                "connected_at": installation.connected_at,
            },
            status=status.HTTP_200_OK,
        )


