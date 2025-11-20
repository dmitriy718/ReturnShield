# How to Get Stripe Credentials for ReturnShield

## Overview

Stripe is used for payment processing and subscription management. You need:
1. **Stripe Secret Key** - For server-side operations
2. **Stripe Publishable Key** - For client-side (optional, not currently used)
3. **Stripe Webhook Secret** - For verifying webhook events
4. **Stripe Price IDs** - For Launch, Scale, and Elite subscription plans

---

## Step 1: Create a Stripe Account

### If you don't have a Stripe account:

1. **Go to Stripe's website**
   - Open your web browser
   - Navigate to: `https://stripe.com`
   - Click the **"Sign up"** button in the top right corner

2. **Sign up for an account**
   - Enter your email address
   - Create a password
   - Fill in your business information
   - Verify your email address

3. **Complete account setup**
   - Add your business details
   - Add a bank account for payouts
   - Complete identity verification (if required)

---

## Step 2: Get Your API Keys

### 2.1 Access the Stripe Dashboard

1. **Log in to Stripe**
   - Go to: `https://dashboard.stripe.com`
   - Enter your email and password
   - Click **"Log in"**

2. **Navigate to API Keys**
   - Look at the left sidebar menu
   - Click on **"Developers"** (it has a code icon)
   - Click on **"API keys"** in the submenu

### 2.2 Get Your Secret Key

1. **Find the "Secret key" section**
   - You'll see two keys: "Publishable key" and "Secret key"
   - The Secret key starts with `sk_live_` (for live) or `sk_test_` (for testing)

2. **Copy the Secret key**
   - Click the **"Reveal test key"** or **"Reveal live key"** button
   - Click the **copy icon** (looks like two overlapping squares) next to the key
   - **IMPORTANT**: This key is secret! Never share it publicly.

3. **Set it in your environment**
   - Add to `.env` file: `STRIPE_SECRET_KEY=sk_live_your_key_here`
   - Or add to Docker compose environment variables

### 2.3 Get Your Publishable Key (Optional)

1. **Find the "Publishable key" section**
   - It's right above the Secret key
   - Starts with `pk_live_` or `pk_test_`

2. **Copy the Publishable key**
   - Click the **copy icon** next to it
   - Add to `.env`: `STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here`

---

## Step 3: Create Subscription Products and Prices

### 3.1 Create the Launch Plan

1. **Go to Products**
   - In the left sidebar, click **"Products"**
   - Click the **"+ Add product"** button

2. **Fill in product details**
   - **Name**: `ReturnShield Launch`
   - **Description**: `Foundational insights and policy automation for emerging brands.`
   - **Pricing model**: Select **"Recurring"**
   - **Price**: Enter `29` and select **USD**
   - **Billing period**: Select **"Monthly"**
   - Click **"Save product"**

3. **Copy the Price ID**
   - After saving, you'll see the product page
   - Find the **"Pricing"** section
   - You'll see a Price ID that starts with `price_`
   - Click the **copy icon** next to it
   - This is your `STRIPE_PRICE_LAUNCH`

### 3.2 Create the Scale Plan

1. **Create another product**
   - Click **"+ Add product"** again
   - **Name**: `ReturnShield Scale`
   - **Description**: `Automate exchange-first workflows and unlock VIP resolution hub.`
   - **Pricing model**: **"Recurring"**
   - **Price**: Enter `99` and select **USD**
   - **Billing period**: **"Monthly"**
   - Click **"Save product"**
   - Copy the Price ID → This is `STRIPE_PRICE_SCALE`

### 3.3 Create the Elite Plan

1. **Create the third product**
   - Click **"+ Add product"** again
   - **Name**: `ReturnShield Elite`
   - **Description**: `Advanced automation with concierge support for high-volume operators.`
   - **Pricing model**: **"Recurring"**
   - **Price**: Enter `249` and select **USD**
   - **Billing period**: **"Monthly"**
   - Click **"Save product"**
   - Copy the Price ID → This is `STRIPE_PRICE_ELITE`

---

## Step 4: Set Up Webhooks

### 4.1 Create a Webhook Endpoint

1. **Go to Webhooks**
   - In the left sidebar, click **"Developers"**
   - Click **"Webhooks"** in the submenu
   - Click **"+ Add endpoint"**

2. **Configure the endpoint**
   - **Endpoint URL**: Enter `https://returnshield.app/api/billing/webhook/`
   - **Description**: `ReturnShield Billing Webhook`
   - **Events to send**: Click **"Select events"**
     - Expand **"Customer"** and check:
       - `customer.subscription.created`
       - `customer.subscription.updated`
       - `customer.subscription.deleted`
     - Expand **"Invoice"** and check:
       - `invoice.paid`
       - `invoice.payment_failed`
     - Click **"Add events"**

3. **Save the endpoint**
   - Click **"Add endpoint"** button

### 4.2 Get Your Webhook Secret

1. **Find the webhook endpoint**
   - You'll see your new webhook in the list
   - Click on it to open details

2. **Copy the Signing secret**
   - Look for **"Signing secret"** section
   - Click **"Reveal"** button
   - Click the **copy icon** next to the secret
   - It starts with `whsec_`
   - This is your `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Test Mode vs Live Mode

### Understanding Test vs Live Keys

- **Test Mode**: Use for development and testing
  - Keys start with `sk_test_` and `pk_test_`
  - No real charges are made
  - Use test card numbers: `4242 4242 4242 4242`

- **Live Mode**: Use for production
  - Keys start with `sk_live_` and `pk_live_`
  - Real charges are made
  - Requires completed account setup

### Switching Between Modes

1. **Toggle mode in dashboard**
   - Look at the top of the Stripe dashboard
   - You'll see a toggle switch: **"Test mode"** / **"Live mode"**
   - Click it to switch

2. **Use appropriate keys**
   - When in Test mode, use test keys
   - When in Live mode, use live keys
   - Make sure your environment variables match the mode

---

## Step 6: Add to Your Environment

### For Local Development (.env file)

Create or edit `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_LAUNCH=price_your_launch_price_id_here
STRIPE_PRICE_SCALE=price_your_scale_price_id_here
STRIPE_PRICE_ELITE=price_your_elite_price_id_here
```

### For Docker Compose (.env file)

Add to your root `.env` file (used by docker-compose.yml):

```env
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_LAUNCH=price_your_launch_price_id_here
STRIPE_PRICE_SCALE=price_your_scale_price_id_here
STRIPE_PRICE_ELITE=price_your_elite_price_id_here
```

### For Frontend (docker-compose.yml)

The frontend also needs the price IDs:

```env
VITE_STRIPE_PRICE_LAUNCH=price_your_launch_price_id_here
VITE_STRIPE_PRICE_SCALE=price_your_scale_price_id_here
VITE_STRIPE_PRICE_ELITE=price_your_elite_price_id_here
```

---

## Step 7: Verify It Works

### Test the Connection

1. **Start your backend server**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Test creating a checkout session**
   - Use a tool like Postman or curl
   - Make a POST request to: `http://localhost:8000/api/billing/create-checkout-session/`
   - Body:
     ```json
     {
       "plan": "launch",
       "price_id": "your_launch_price_id",
       "success_url": "http://localhost:4173/billing/success",
       "cancel_url": "http://localhost:4173/billing"
     }
     ```
   - You should get back a `checkout_url`

3. **Test the webhook**
   - In Stripe dashboard, go to your webhook
   - Click **"Send test webhook"**
   - Select an event type (e.g., `customer.subscription.created`)
   - Click **"Send test webhook"**
   - Check your backend logs to see if it was received

---

## Troubleshooting

### Problem: "Stripe is not configured" error

**Solution**: Make sure `STRIPE_SECRET_KEY` is set in your environment variables.

### Problem: "Invalid plan selection" error

**Solution**: 
- Verify your price IDs are correct
- Make sure they match between backend and frontend
- Check that the price IDs exist in your Stripe account

### Problem: Webhook not receiving events

**Solution**:
- Verify the webhook URL is accessible from the internet
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Make sure the webhook endpoint is in Live mode if you're using live keys

### Problem: Test mode vs Live mode confusion

**Solution**:
- Always use test keys in development
- Switch to live keys only in production
- Make sure all keys (secret, publishable, webhook) are from the same mode

---

## Security Best Practices

1. **Never commit keys to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables, not hardcoded keys

2. **Rotate keys regularly**
   - In Stripe dashboard → Developers → API keys
   - Click **"Roll key"** to create a new key
   - Update your environment variables

3. **Use different keys for test and production**
   - Never use live keys in development
   - Never use test keys in production

4. **Restrict API key permissions** (if possible)
   - Stripe keys have full access by default
   - Consider using restricted API keys for specific operations

---

## Additional Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Stripe Testing**: https://stripe.com/docs/testing
- **Stripe Webhooks Guide**: https://stripe.com/docs/webhooks

---

## Quick Reference Checklist

- [ ] Created Stripe account
- [ ] Got Secret key (`sk_live_...` or `sk_test_...`)
- [ ] Got Publishable key (`pk_live_...` or `pk_test_...`)
- [ ] Created Launch product and got Price ID
- [ ] Created Scale product and got Price ID
- [ ] Created Elite product and got Price ID
- [ ] Created webhook endpoint
- [ ] Got Webhook secret (`whsec_...`)
- [ ] Added all keys to environment variables
- [ ] Tested checkout session creation
- [ ] Tested webhook reception

---

**Last Updated**: 2025-01-XX

