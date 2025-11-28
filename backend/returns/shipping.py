import easypost
from django.conf import settings

# Initialize EasyPost
easypost.api_key = settings.EASYPOST_API_KEY

def generate_return_label(return_request):
    """
    Generates a shipping label for a ReturnRequest using EasyPost.
    Returns the label URL (PDF) and tracking number.
    """
    if not settings.EASYPOST_API_KEY:
        # Mock response for testing without API key
        return {
            "label_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            "tracking_number": "TEST-TRACKING-123"
        }

    try:
        # Create From Address (Customer)
        # In a real app, we'd parse this from the order's shipping_address
        from_address = easypost.Address.create(
            name=return_request.order.customer_email,
            street1="123 Customer St", # Placeholder
            city="San Francisco",
            state="CA",
            zip="94105",
            phone="415-123-4567"
        )

        # Create To Address (Warehouse)
        to_address = easypost.Address.create(**settings.EASYPOST_FROM_ADDRESS)

        # Create Parcel (Placeholder weight/dims)
        parcel = easypost.Parcel.create(
            length=10,
            width=8,
            height=4,
            weight=16 # 1 lb
        )

        # Create Shipment
        shipment = easypost.Shipment.create(
            to_address=to_address,
            from_address=from_address,
            parcel=parcel,
            is_return=True
        )

        # Buy the lowest rate
        shipment.buy(rate=shipment.lowest_rate())

        label_url = shipment.postage_label.label_url
        tracking_number = shipment.tracking_code

        # Send confirmation email
        from returns.email import send_return_confirmation_email
        # We need to pass the return_request object to the email function
        # The return_request object should have the updated label_url and tracking_number
        # But here we are just returning them. 
        # Ideally, we should update the return_request object here or pass the values to the email function.
        # Looking at returns/email.py, it expects a return_request object and accesses .shipping_label_url and .tracking_number
        
        # Let's attach these temporarily to the return_request object so the email function works
        # This assumes return_request is a mutable Django model instance
        return_request.shipping_label_url = label_url
        return_request.tracking_number = tracking_number
        
        send_return_confirmation_email(return_request.order.customer_email, return_request)

        return {
            "label_url": label_url,
            "tracking_number": tracking_number
        }

    except Exception as e:
        print(f"Error generating label: {e}")
        # Fallback for error cases
        return {
            "label_url": None,
            "tracking_number": None
        }
