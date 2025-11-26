"""
Shopify data synchronization tasks.
"""
import logging
from datetime import timedelta

import shopify
from celery import shared_task
from django.utils import timezone

from shopify_integration.models import ShopifyInstallation


logger = logging.getLogger(__name__)


@shared_task
def sync_shopify_orders(installation_id):
    """
    Background task to sync orders from a Shopify store.
    
    Args:
        installation_id: ID of the ShopifyInstallation record
    """
    try:
        installation = ShopifyInstallation.objects.get(id=installation_id)
    except ShopifyInstallation.DoesNotExist:
        logger.error(f"ShopifyInstallation {installation_id} not found")
        return
    
    if not installation.active:
        logger.info(f"Skipping inactive installation: {installation.shop_domain}")
        return
    
    # Initialize Shopify API session
    session = shopify.Session(installation.shop_domain, '2024-01', installation.access_token)
    shopify.ShopifyResource.activate_session(session)
    
    try:
        # Fetch orders since last sync (or 12 months if first sync)
        last_sync = installation.last_synced_at or (timezone.now() - timedelta(days=365))
        
        logger.info(f"Syncing orders for {installation.shop_domain} since {last_sync}")
        
        # Shopify API limits to 250 orders per page
        page = 1
        synced_count = 0
        
        while True:
            orders = shopify.Order.find(
                created_at_min=last_sync.isoformat(),
                limit=250,
                page=page
            )
            
            if not orders:
                break
            
            for shopify_order in orders:
                _create_or_update_order(installation, shopify_order)
                synced_count += 1
            
            page += 1
            
            # Safety limit to prevent infinite loops
            if page > 100:
                logger.warning(f"Hit page limit for {installation.shop_domain}")
                break
        
        # Update last sync time
        installation.last_synced_at = timezone.now()
        installation.save(update_fields=['last_synced_at'])
        
        logger.info(f"Successfully synced {synced_count} orders for {installation.shop_domain}")
        
    except Exception as exc:
        logger.exception(f"Error syncing orders for {installation.shop_domain}: {exc}")
        raise
    finally:
        shopify.ShopifyResource.clear_session()


@shared_task
def sync_all_installations():
    """
    Periodic task to sync all active Shopify installations.
    Runs every 15 minutes via Celery Beat.
    """
    active_installations = ShopifyInstallation.objects.filter(active=True)
    
    logger.info(f"Starting sync for {active_installations.count()} Shopify installations")
    
    for installation in active_installations:
        # Queue individual sync tasks
        sync_shopify_orders.delay(installation.id)
    
    logger.info(f"Queued sync tasks for {active_installations.count()} installations")


def _create_or_update_order(installation, shopify_order):
    """Helper to create or update an Order record from Shopify data."""
    from decimal import Decimal
    from returns.models import Order
    
    order_data = {
        'user': installation.user,
        'customer_email': shopify_order.email if hasattr(shopify_order, 'email') else '',
        'total': Decimal(str(shopify_order.total_price)),
        'currency': shopify_order.currency if hasattr(shopify_order, 'currency') else 'USD',
        'created_at': shopify_order.created_at,
        'line_items': [
            {
                'id': str(item.id),
                'sku': item.sku if hasattr(item, 'sku') else '',
                'name': item.name,
                'price': str(item.price),
                'quantity': item.quantity,
                'variant_id': str(item.variant_id) if hasattr(item, 'variant_id') else None,
            }
            for item in shopify_order.line_items
        ],
        'shipping_address': {},
        'raw_data': shopify_order.to_dict() if hasattr(shopify_order, 'to_dict') else {},
    }
    
    # Handle shipping address safely
    if hasattr(shopify_order, 'shipping_address') and shopify_order.shipping_address:
        addr = shopify_order.shipping_address
        order_data['shipping_address'] = {
            'address1': getattr(addr, 'address1', ''),
            'address2': getattr(addr, 'address2', ''),
            'city': getattr(addr, 'city', ''),
            'province': getattr(addr, 'province', ''),
            'country': getattr(addr, 'country', ''),
            'zip': getattr(addr, 'zip', ''),
        }
    
    Order.objects.update_or_create(
        external_id=str(shopify_order.id),
        platform='shopify',
        user=installation.user,
        defaults=order_data
    )
