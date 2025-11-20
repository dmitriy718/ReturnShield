# How to Get HelpScout Credentials for ReturnShield

## Overview

HelpScout is used for customer support and help desk functionality. You need:
1. **HelpScout App ID** - Your application identifier
2. **HelpScout App Secret** - Your application secret key
3. **HelpScout Mailbox ID** - The mailbox ID for support tickets

**Note**: HelpScout integration is optional. The app will work without it, but support features won't be available.

---

## Step 1: Create a HelpScout Account

### If you don't have a HelpScout account:

1. **Go to HelpScout's website**
   - Open your web browser
   - Navigate to: `https://www.helpscout.com`
   - Click **"Start free trial"** or **"Sign up"**

2. **Sign up for an account**
   - Enter your email address
   - Create a password
   - Fill in your business information
   - Select a plan (you can start with a free trial)
   - Verify your email address

3. **Complete account setup**
   - Add your company name
   - Set up your first mailbox
   - Complete any required verification steps

---

## Step 2: Create a Mailbox

### 2.1 Create Your Support Mailbox

1. **Go to Mailboxes**
   - In the left sidebar, click **"Mailboxes"**
   - Click **"Add mailbox"** or **"Create mailbox"**

2. **Configure the mailbox**
   - **Mailbox name**: `ReturnShield Support` (or similar)
   - **Email address**: `support@returnshield.app` (or your support email)
   - **Time zone**: Select your timezone
   - Click **"Create mailbox"**

3. **Get the Mailbox ID**
   - After creating, you'll be in the mailbox settings
   - Look at the URL in your browser
   - It will look like: `https://secure.helpscout.net/settings/mailbox/123456/`
   - The number (`123456`) is your **Mailbox ID**
   - OR go to **"Settings"** → **"Mailboxes"** → Click your mailbox → The ID is in the URL

---

## Step 3: Create a HelpScout App

### 3.1 Access Developer Settings

1. **Go to Settings**
   - In the left sidebar, click **"Settings"** (gear icon ⚙️)
   - Scroll down and click **"Integrations"**
   - Look for **"Custom Apps"** or **"API"**

2. **Navigate to Custom Apps**
   - Click **"Custom Apps"** or **"API"**
   - You might need to enable developer mode first

### 3.2 Create a New App

1. **Click "Create App"**
   - Look for a button that says **"Create App"** or **"New App"**
   - Click it

2. **Fill in app details**
   - **App Name**: `ReturnShield Integration`
   - **Description**: `Integration for ReturnShield support features`
   - **Redirect URI**: `https://returnshield.app/api/support/callback/` (or your callback URL)
   - Click **"Create"** or **"Save"**

### 3.3 Get App Credentials

1. **Find App ID**
   - After creating, you'll see your app details
   - Look for **"App ID"** or **"Client ID"**
   - Click the **copy icon** next to it
   - This is your `HELPSCOUT_APP_ID`

2. **Find App Secret**
   - Look for **"App Secret"** or **"Client Secret"**
   - You might need to click **"Reveal"** or **"Show"**
   - Click the **copy icon** next to it
   - **IMPORTANT**: Keep this secret! Never share it publicly.
   - This is your `HELPSCOUT_APP_SECRET`

---

## Step 4: Configure App Permissions

### 4.1 Set Required Scopes

1. **Go to App Settings**
   - In your app details, look for **"Scopes"** or **"Permissions"**

2. **Enable required scopes**
   - Check the following scopes:
     - `mailboxes.read` - To read mailbox information
     - `conversations.read` - To read conversations
     - `conversations.write` - To create/update conversations
     - `customers.read` - To read customer information
   - Click **"Save"**

---

## Step 5: Add to Your Environment

### For Local Development (.env file)

Create or edit `backend/.env`:

```env
HELPSCOUT_APP_ID=your_app_id_here
HELPSCOUT_APP_SECRET=your_app_secret_here
HELPSCOUT_MAILBOX_ID=your_mailbox_id_here
```

### For Docker Compose (.env file)

Add to your root `.env` file:

```env
HELPSCOUT_APP_ID=your_app_id_here
HELPSCOUT_APP_SECRET=your_app_secret_here
HELPSCOUT_MAILBOX_ID=your_mailbox_id_here
```

---

## Step 6: Test HelpScout Integration

### 6.1 Test API Connection

1. **Start your backend**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Test the connection**
   - HelpScout integration is used in `backend/support/views.py`
   - The integration creates support tickets and conversations
   - Check your HelpScout mailbox for test tickets

### 6.2 Verify Integration

1. **Check HelpScout Dashboard**
   - Go to your HelpScout dashboard
   - Navigate to your mailbox
   - Look for any test conversations or tickets

2. **Test creating a ticket**
   - Use the support endpoint (if implemented)
   - Verify tickets appear in HelpScout

---

## Step 7: Understanding HelpScout Plans

### Standard Plan
- **Cost**: $25/user/month
- **Features**: Email, live chat, knowledge base
- **Good for**: Small teams

### Plus Plan
- **Cost**: $50/user/month
- **Features**: Everything in Standard + advanced reporting
- **Good for**: Growing teams

### Pro Plan
- **Cost**: Custom pricing
- **Features**: Everything + custom integrations
- **Good for**: Large organizations

**For ReturnShield**: Start with Standard plan, upgrade as needed.

---

## Troubleshooting

### Problem: "Invalid App ID" error

**Solution**: 
- Verify `HELPSCOUT_APP_ID` is correct
- Make sure there are no extra spaces
- Check that the app exists in HelpScout

### Problem: "Invalid App Secret" error

**Solution**:
- Verify `HELPSCOUT_APP_SECRET` is correct
- Make sure it matches the App ID
- Check for typos or extra characters

### Problem: "Mailbox not found" error

**Solution**:
- Verify `HELPSCOUT_MAILBOX_ID` is correct
- Make sure the mailbox exists
- Check that you have access to the mailbox

### Problem: "Insufficient permissions" error

**Solution**:
- Check that all required scopes are enabled
- Verify app permissions in HelpScout settings
- Make sure the app has access to the mailbox

### Problem: Can't find Custom Apps section

**Solution**:
- Make sure you're on a paid HelpScout plan
- Custom Apps might require a specific plan tier
- Contact HelpScout support for assistance

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables only

2. **Rotate secrets if compromised**
   - In HelpScout → Settings → Custom Apps
   - Regenerate App Secret
   - Update environment variables immediately

3. **Restrict app access**
   - Only grant necessary scopes
   - Monitor app usage regularly
   - Revoke access if no longer needed

---

## Additional Resources

- **HelpScout Documentation**: https://developer.helpscout.com
- **HelpScout API Reference**: https://developer.helpscout.com/mailbox-api
- **HelpScout Custom Apps**: https://developer.helpscout.com/custom-apps

---

## Quick Reference Checklist

- [ ] Created HelpScout account
- [ ] Created a mailbox
- [ ] Got Mailbox ID
- [ ] Created a Custom App
- [ ] Got App ID
- [ ] Got App Secret
- [ ] Configured required scopes
- [ ] Added credentials to environment variables
- [ ] Tested API connection
- [ ] Verified integration works

---

## Current Configuration in Code

HelpScout integration is configured in `backend/core/settings.py`:

```python
HELPSCOUT_APP_ID = os.getenv("HELPSCOUT_APP_ID", "")
HELPSCOUT_APP_SECRET = os.getenv("HELPSCOUT_APP_SECRET", "")
HELPSCOUT_MAILBOX_ID = os.getenv("HELPSCOUT_MAILBOX_ID", "")
```

The integration is used in `backend/support/views.py` and `backend/support/services.py`.

---

## Note: HelpScout is Optional

If you don't want to use HelpScout right now:
- The app will work without these credentials
- Support features simply won't be available
- You can add HelpScout later when needed
- Set empty strings or omit the variables

---

**Last Updated**: 2025-01-XX

