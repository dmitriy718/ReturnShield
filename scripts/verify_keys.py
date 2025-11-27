import os
import stripe
import openai
from dotenv import load_dotenv

load_dotenv()

def test_stripe():
    print("Testing Stripe...")
    stripe_key = os.getenv("STRIPE_SECRET_KEY")
    if not stripe_key:
        print("❌ STRIPE_SECRET_KEY is missing")
        return
    
    stripe.api_key = stripe_key
    try:
        # Try to list 1 product to verify key
        stripe.Product.list(limit=1)
        print("✅ Stripe key is VALID")
    except Exception as e:
        print(f"❌ Stripe key FAILED: {e}")

def test_openai():
    print("\nTesting OpenAI...")
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        print("❌ OPENAI_API_KEY is missing")
        return

    client = openai.OpenAI(api_key=openai_key)
    try:
        client.models.list()
        print("✅ OpenAI key is VALID")
    except Exception as e:
        print(f"❌ OpenAI key FAILED: {e}")

def test_sendgrid():
    print("\nTesting SendGrid...")
    sendgrid_key = os.getenv("SENDGRID_API_KEY")
    if not sendgrid_key:
        print("❌ SENDGRID_API_KEY is missing")
        return
    # TODO: Add SendGrid verification if key is provided
    print("⚠️ SendGrid key verification not implemented (key missing or empty)")

if __name__ == "__main__":
    test_stripe()
    test_openai()
    test_sendgrid()
