from __future__ import annotations

import logging

import requests
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from .models import WooCommerceConnection
from .serializers import WooCommerceConnectSerializer

logger = logging.getLogger(__name__)


class WooCommerceConnectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = WooCommerceConnectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        site_url = data["site_url"]
        consumer_key = data["consumer_key"]
        consumer_secret = data["consumer_secret"]

        try:
            response = requests.get(
                f"{site_url}/wp-json/wc/v3",
                auth=(consumer_key, consumer_secret),
                timeout=10,
            )
        except requests.RequestException as exc:
            logger.exception("WooCommerce verification failed: %s", exc)
            return Response(
                {"detail": "Unable to reach WooCommerce API. Please verify credentials."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if response.status_code != 200:
            return Response(
                {"detail": "WooCommerce credentials could not be verified."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        connection, _created = WooCommerceConnection.objects.get_or_create(
            user=request.user,
            defaults={
                "site_url": site_url,
                "consumer_key": consumer_key,
                "consumer_secret": consumer_secret,
                "active": True,
            },
        )

        if not _created:
            connection.site_url = site_url
            connection.consumer_key = consumer_key
            connection.consumer_secret = consumer_secret
            connection.mark_active()
        else:
            connection.mark_active()

        self._update_user_store_profile(request.user, site_url)

        return Response(
            {"status": "connected", "site_url": site_url},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def _update_user_store_profile(user: User, site_url: str) -> None:
        user.store_platform = User.StorePlatform.WOOCOMMERCE
        user.store_domain = site_url
        user.save(update_fields=["store_platform", "store_domain", "has_shopify_store", "shopify_domain"])


class WooCommerceStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            connection = request.user.woocommerce_connection
        except WooCommerceConnection.DoesNotExist:
            return Response({"connected": False}, status=status.HTTP_200_OK)

        return Response(
            {
                "connected": connection.active,
                "site_url": connection.site_url,
                "connected_at": connection.connected_at,
            },
            status=status.HTTP_200_OK,
        )


