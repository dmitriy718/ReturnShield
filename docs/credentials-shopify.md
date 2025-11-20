# How to Get Shopify Credentials for ReturnShield

## Overview

Shopify credentials are needed to integrate ReturnShield with Shopify stores. You need:
1. **Shopify Client ID** - Your app's public identifier
2. **Shopify Client Secret** - Your app's secret key (keep this secure!)

---

## Step 1: Create a Shopify Partner Account

### If you don't have a Shopify Partner account:

1. **Go to Shopify Partners**
   - Open your web browser
   - Navigate to: `https://partners.shopify.com`
   - Click **"Sign up"** or **"Join now"**

2. **Sign up for an account**
   - Enter your email address
   - Create a password
   - Fill in your business information
   - Accept the terms and conditions
   - Verify your email address

3. **Complete your profile**
   - Add your company name
   - Add your contact information
   - Complete any required verification steps

---

## Step 2: Create a Shopify App

### 2.1 Access the Partner Dashboard

1. **Log in to Shopify Partners**
   - Go to: `https://partners.shopify.com`
   - Enter your email and password
   - Click **"Log in"**

2. **Navigate to Apps**
   - Look at the left sidebar menu
   - Click on **"Apps"**
   - You'll see a list of your apps (might be empty if this is your first)

### 2.2 Create a New App

1. **Click "Create app"**
   - Look for a button that says **"Create app"** or **"+ Create app"**
   - It's usually in the top right corner or as a card on the page

2. **Choose app type**
   - Select **"Custom app"** (for private/internal use)
   - OR select **"Public app"** (if you want to list it in the Shopify App Store)
   - For ReturnShield, **"Custom app"** is recommended initially

3. **Fill in app details**
   - **App name**: `ReturnShield`
   - **App URL**: `https://returnshield.app`
   - **Allowed redirection URL(s)**: 
     - Add: `https://returnshield.app/api/shopify/callback/`
     - Add: `https://app.returnshield.app/api/shopify/callback/`
     - Add any localhost URLs for testing: `http://localhost:8000/api/shopify/callback/`
   - Click **"Create app"**

---

## Step 3: Get Your App Credentials

### 3.1 Access App Credentials

1. **Open your app**
   - After creating, you'll be taken to the app overview page
   - OR click on your app name from the Apps list

2. **Go to API credentials**
   - Look for a tab or section called **"API credentials"** or **"Client credentials"**
   - Click on it

### 3.2 Get Client ID

1. **Find the Client ID**
   - You'll see a field labeled **"Client ID"** or **"API key"**
   - It's a long string of letters and numbers
   - Click the **copy icon** (looks like two overlapping squares) next to it
   - This is your `SHOPIFY_CLIENT_ID`

### 3.3 Get Client Secret

1. **Find the Client Secret**
   - Look for a field labeled **"Client secret"** or **"API secret key"**
   - You might need to click **"Reveal"** or **"Show"** to see it
   - Click the **copy icon** next to it
   - **IMPORTANT**: This is secret! Never share it publicly.
   - This is your `SHOPIFY_CLIENT_SECRET`

---

## Step 4: Configure App Scopes

### 4.1 Set Required Scopes

1. **Go to Configuration**
   - In your app settings, look for **"Configuration"** or **"Scopes"**
   - Click on it

2. **Select required scopes**
   - Find the **"Admin API scopes"** section
   - Check the following scopes:
     - `read_orders` - To read order information
     - `write_orders` - To update orders (for exchanges)
     - `read_returns` - To read return information
   - Click **"Save"**

**Note**: The scopes are already configured in the code (`SHOPIFY_SCOPES` in `settings.py`), but you need to enable them in your Shopify app.

---

## Step 5: Configure App URLs

### 5.1 Set App URLs

1. **Go to App setup**
   - In your app settings, find **"App setup"** or **"URLs"**

2. **Configure URLs**
   - **App URL**: `https://returnshield.app` (or your production URL)
   - **Allowed redirection URL(s)**: 
     ```
     https://returnshield.app/api/shopify/callback/
     https://app.returnshield.app/api/shopify/callback/
     http://localhost:8000/api/shopify/callback/
     ```
   - Click **"Save"**

---

## Step 6: Add to Your Environment

### For Local Development (.env file)

Create or edit `backend/.env`:

```env
SHOPIFY_CLIENT_ID=your_client_id_here
SHOPIFY_CLIENT_SECRET=your_client_secret_here
SHOPIFY_APP_URL=https://returnshield.app
```

### For Docker Compose (.env file)

Add to your root `.env` file:

```env
SHOPIFY_CLIENT_ID=your_client_id_here
SHOPIFY_CLIENT_SECRET=your_client_secret_here
SHOPIFY_APP_URL=https://returnshield.app
```

---

## Step 7: Test the Integration

### 7.1 Test App Installation Flow

1. **Start your backend server**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Test the install URL endpoint**
   - Make a POST request to: `http://localhost:8000/api/shopify/install-url/`
   - Body:
     ```json
     {
       "shop_domain": "your-test-store.myshopify.com"
     }
     ```
   - You should get back an `install_url`

3. **Test the callback**
   - The callback will be called by Shopify after app installation
   - Make sure your callback URL is accessible
   - Check your backend logs for any errors

### 7.2 Test with a Development Store

1. **Create a development store**
   - In Shopify Partners dashboard
   - Go to **"Stores"** → **"Add store"** → **"Development store"**
   - Fill in details and create the store

2. **Install your app**
   - Go to your development store admin
   - Navigate to **"Apps"** → **"Develop apps"**
   - Find your app and click **"Install"**
   - Authorize the requested permissions

3. **Verify installation**
   - Check that the app appears in your store's apps list
   - Check your backend database for the installation record

---

## Step 8: Understanding Shopify App Types

### Custom App (Recommended for Private Use)

- **Pros**: 
  - Easier to set up
  - No review process
  - Good for internal/private use
- **Cons**: 
  - Can't be listed in App Store
  - Limited distribution

### Public App (For App Store)

- **Pros**: 
  - Can be listed in Shopify App Store
  - Can be installed by any merchant
- **Cons**: 
  - Requires review process
  - More complex setup
  - Must follow Shopify guidelines

**For ReturnShield**: Start with a Custom App, then convert to Public App later if needed.

---

## Troubleshooting

### Problem: "Invalid client ID" error

**Solution**: 
- Verify `SHOPIFY_CLIENT_ID` is correct
- Make sure there are no extra spaces
- Check that you copied the entire ID

### Problem: "Invalid signature" error

**Solution**:
- Verify `SHOPIFY_CLIENT_SECRET` is correct
- Make sure the secret matches the client ID
- Check for typos or extra characters

### Problem: "Redirect URI mismatch" error

**Solution**:
- Check that your callback URL is in the "Allowed redirection URL(s)" list
- Make sure the URL matches exactly (including trailing slash)
- Verify the URL is accessible from the internet

### Problem: App installation fails

**Solution**:
- Check that all required scopes are enabled
- Verify your app URLs are configured correctly
- Make sure your backend is running and accessible
- Check backend logs for detailed error messages

### Problem: Can't find API credentials

**Solution**:
- Make sure you're in the correct app
- Look for "Client credentials" or "API credentials" tab
- Some apps might need to be "activated" first

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables, not hardcoded values

2. **Rotate secrets if compromised**
   - In Shopify Partners → Your App → API credentials
   - Click **"Regenerate"** to create new credentials
   - Update your environment variables immediately

3. **Use HTTPS in production**
   - Shopify requires HTTPS for production apps
   - Make sure your callback URLs use `https://`

4. **Restrict app access**
   - Only install the app on stores you trust
   - Monitor app installations regularly

---

## Additional Resources

- **Shopify Partners Documentation**: https://shopify.dev/apps
- **Shopify API Reference**: https://shopify.dev/api/admin-rest
- **Shopify App Development Guide**: https://shopify.dev/apps/getting-started
- **OAuth Flow Documentation**: https://shopify.dev/apps/auth/oauth

---

## Quick Reference Checklist

- [ ] Created Shopify Partner account
- [ ] Created a Shopify app
- [ ] Got Client ID
- [ ] Got Client Secret
- [ ] Configured required scopes (read_orders, write_orders, read_returns)
- [ ] Set App URL
- [ ] Added callback URLs to allowed redirection URLs
- [ ] Added credentials to environment variables
- [ ] Tested install URL endpoint
- [ ] Tested with a development store
- [ ] Verified app installation works

---

## Current Configuration in Code

The following scopes are configured in `backend/core/settings.py`:

```python
SHOPIFY_SCOPES = ["read_orders", "write_orders", "read_returns"]
```

Make sure these match what you've enabled in your Shopify app settings.

---

**Last Updated**: 2025-01-XX

