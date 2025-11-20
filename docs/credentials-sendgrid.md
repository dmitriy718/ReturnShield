# How to Get SendGrid Credentials for ReturnShield

## Overview

SendGrid is used for sending transactional emails (like onboarding emails). You need:
1. **SendGrid API Key** - For authenticating API requests
2. **From Email Address** - The email address that sends emails
3. **From Name** (Optional) - The display name for emails

---

## Step 1: Create a SendGrid Account

### If you don't have a SendGrid account:

1. **Go to SendGrid's website**
   - Open your web browser
   - Navigate to: `https://sendgrid.com`
   - Click the **"Start for free"** or **"Sign up"** button

2. **Sign up for an account**
   - Enter your email address
   - Create a password
   - Fill in your business information
   - Accept the terms and conditions
   - Verify your email address

3. **Complete account setup**
   - Add your company name
   - Select your use case (e.g., "Transactional emails")
   - Complete any required verification steps

---

## Step 2: Verify Your Sender Identity

### 2.1 Single Sender Verification (Easiest for Testing)

1. **Go to Settings**
   - In the left sidebar, click **"Settings"**
   - Click **"Sender Authentication"**

2. **Click "Verify a Single Sender"**
   - This is the easiest option for testing
   - Click the button to start

3. **Fill in sender details**
   - **From Name**: `ReturnShield Concierge`
   - **From Email**: `concierge@returnshield.app` (or your email)
   - **Reply To**: Same as From Email
   - **Company Address**: Your business address
   - **Company Website**: `https://returnshield.app`
   - Click **"Create"**

4. **Verify your email**
   - SendGrid will send a verification email
   - Check your inbox and click the verification link
   - Your sender is now verified!

### 2.2 Domain Authentication (Recommended for Production)

1. **Go to Domain Authentication**
   - In Sender Authentication, click **"Authenticate Your Domain"**
   - This is better for production use

2. **Enter your domain**
   - Enter: `returnshield.app`
   - Click **"Next"**

3. **Add DNS records**
   - SendGrid will provide DNS records to add
   - Go to your domain registrar (where you bought the domain)
   - Add the provided DNS records
   - Wait for DNS propagation (can take up to 48 hours)

4. **Verify domain**
   - Click **"Verify"** in SendGrid
   - Once verified, you can send from any email on that domain

---

## Step 3: Create an API Key

### 3.1 Navigate to API Keys

1. **Go to Settings**
   - In the left sidebar, click **"Settings"**
   - Click **"API Keys"**

2. **Create a new API key**
   - Click **"Create API Key"** button
   - You'll see a form to create the key

### 3.2 Configure the API Key

1. **Set API Key Name**
   - **Name**: `ReturnShield Production` (or similar)
   - This is just a label for your reference

2. **Set API Key Permissions**
   - Select **"Full Access"** (for simplicity)
   - OR select **"Restricted Access"** and enable:
     - **Mail Send** → **Full Access**
     - This is more secure but requires more setup

3. **Create the key**
   - Click **"Create & View"** button
   - **IMPORTANT**: Copy the API key immediately!
   - You won't be able to see it again after closing this window
   - The key starts with `SG.` followed by a long string

---

## Step 4: Add to Your Environment

### For Local Development (.env file)

Create or edit `backend/.env`:

```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=concierge@returnshield.app
SENDGRID_FROM_NAME=ReturnShield Concierge
```

### For Docker Compose (.env file)

Add to your root `.env` file:

```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=concierge@returnshield.app
SENDGRID_FROM_NAME=ReturnShield Concierge
```

---

## Step 5: Test Email Sending

### 5.1 Test with Python

1. **Create a test script**
   ```python
   import os
   from sendgrid import SendGridAPIClient
   from sendgrid.helpers.mail import Mail
   
   api_key = os.getenv('SENDGRID_API_KEY')
   message = Mail(
       from_email='concierge@returnshield.app',
       to_emails='your-email@example.com',
       subject='Test Email from ReturnShield',
       html_content='<p>This is a test email!</p>'
   )
   
   try:
       sg = SendGridAPIClient(api_key)
       response = sg.send(message)
       print(f"Email sent! Status: {response.status_code}")
   except Exception as e:
       print(f"Error: {e}")
   ```

2. **Run the test**
   ```bash
   cd backend
   python test_email.py
   ```

3. **Check your inbox**
   - You should receive the test email
   - Check spam folder if not in inbox

### 5.2 Test via ReturnShield

1. **Register a new user**
   - Go to your registration page
   - Create a test account
   - Check if the onboarding email is sent

2. **Check SendGrid Activity**
   - Go to SendGrid dashboard
   - Click **"Activity"** in the left sidebar
   - You should see email delivery status

---

## Step 6: Understanding SendGrid Plans

### Free Plan
- **Cost**: Free
- **Emails per day**: 100
- **Good for**: Testing and small projects

### Essentials Plan
- **Cost**: $19.95/month
- **Emails per month**: 50,000
- **Good for**: Small to medium businesses

### Pro Plan
- **Cost**: $89.95/month
- **Emails per month**: 100,000
- **Good for**: Growing businesses

**For ReturnShield**: Start with Free plan for testing, upgrade as needed.

---

## Troubleshooting

### Problem: "Invalid API key" error

**Solution**: 
- Verify the API key is correct (starts with `SG.`)
- Make sure there are no extra spaces
- Check that the key has "Mail Send" permissions

### Problem: Emails not being sent

**Solution**:
- Check SendGrid Activity dashboard for errors
- Verify sender email is verified
- Check spam folder
- Verify API key has correct permissions

### Problem: "Sender not verified" error

**Solution**:
- Complete sender verification (Single Sender or Domain)
- Wait for verification to complete
- Make sure the "From Email" matches verified sender

### Problem: Emails going to spam

**Solution**:
- Use Domain Authentication instead of Single Sender
- Set up SPF and DKIM records
- Avoid spam trigger words in subject/content
- Warm up your sending domain gradually

---

## Security Best Practices

1. **Never commit API keys to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables only

2. **Use Restricted API Keys**
   - Only grant "Mail Send" permission
   - Don't use "Full Access" in production if possible

3. **Rotate keys regularly**
   - Create new API keys periodically
   - Delete old unused keys

4. **Monitor usage**
   - Check SendGrid dashboard regularly
   - Set up alerts for unusual activity

---

## Additional Resources

- **SendGrid Documentation**: https://docs.sendgrid.com
- **SendGrid API Reference**: https://docs.sendgrid.com/api-reference
- **Email Best Practices**: https://docs.sendgrid.com/for-developers/sending-email/best-practices

---

## Quick Reference Checklist

- [ ] Created SendGrid account
- [ ] Verified sender identity (Single Sender or Domain)
- [ ] Created API key
- [ ] Copied API key (starts with `SG.`)
- [ ] Added API key to environment variables
- [ ] Set FROM_EMAIL and FROM_NAME
- [ ] Tested email sending
- [ ] Verified emails are received
- [ ] Checked SendGrid Activity dashboard

---

## Current Configuration in Code

The email sending is configured in `backend/notifications/email.py`:

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDGRID_FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL", "support@returnshield.app")
SENDGRID_FROM_NAME = os.getenv("SENDGRID_FROM_NAME", "ReturnShield Concierge")
```

---

**Last Updated**: 2025-01-XX

