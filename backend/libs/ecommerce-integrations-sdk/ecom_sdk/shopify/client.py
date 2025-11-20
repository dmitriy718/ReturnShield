import shopify
from pydantic import BaseModel, Field

class Shop(BaseModel):
    id: int
    name: str
    domain: str
    email: str

class ShopifyClient:
    def __init__(self, shop_domain: str, access_token: str, api_version: str = "2023-10"):
        self.shop_domain = shop_domain
        self.access_token = access_token
        self.api_version = api_version
        self._session = None

    def __enter__(self):
        self._session = shopify.Session(self.shop_domain, self.api_version, self.access_token)
        shopify.ShopifyResource.activate_session(self._session)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        shopify.ShopifyResource.clear_session()

    def get_shop_info(self) -> Shop:
        """
        Retrieves information about the shop.
        """
        shop_data = shopify.Shop.current()
        return Shop.parse_obj(shop_data.to_dict())
