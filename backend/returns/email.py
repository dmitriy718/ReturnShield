import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings

def send_return_confirmation_email(to_email, return_request):
    """
    Sends a return confirmation email with the shipping label URL.
    """
    if not settings.SENDGRID_API_KEY:
        print("WARNING: SENDGRID_API_KEY not set. Email not sent.")
        return

    subject = f"Return Confirmation - Order #{return_request.order.order_number}"
    
    # Simple HTML template
    html_content = f"""
    <h1>Return Confirmed</h1>
    <p>We have received your return request for Order #{return_request.order.order_number}.</p>
    <p><strong>Status:</strong> {return_request.status}</p>
    <p><strong>Refund Method:</strong> {return_request.refund_amount} (Store Credit/Refund)</p>
    
    <h2>Shipping Label</h2>
    <p>Please download your shipping label below and attach it to your package:</p>
    <p><a href="{return_request.shipping_label_url}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Shipping Label</a></p>
    
    <p>Or click here: {return_request.shipping_label_url}</p>
    
    <p>Tracking Number: {return_request.tracking_number}</p>
    
    <p>Thank you,<br>ReturnShield Team</p>
    """

    message = Mail(
        from_email=settings.SENDGRID_FROM_EMAIL,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )

    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email sent to {to_email}. Status Code: {response.status_code}")
        return response.status_code
    except Exception as e:
        print(f"Error sending email: {e}")
        return None
