# E-commerce Integrations SDK

A Python SDK for integrating with various e-commerce platforms.

## Installation

```bash
pip install .
```

## Usage

```python
from ecom_sdk.shopify import ShopifyClient

client = ShopifyClient(shop_domain="your-shop.myshopify.com", access_token="your-access-token")

shop_info = client.get_shop_info()
print(shop_info)
```
