# Required Credentials Summary for ReturnShield

## Quick Overview

This document summarizes all the credentials and services you need to configure ReturnShield. Each item has a detailed guide in the `docs/` folder.

---

## ✅ Critical (Required for Basic Functionality)

### 1. Django Configuration
- **DJANGO_SECRET_KEY** - Generate using: `python manage.py shell` → `from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())`
- **DJANGO_DEBUG** - Set to `0` for production, `1` for development
- **DJANGO_ALLOWED_HOSTS** - Your domains: `returnshield.app,app.returnshield.app,65.38.99.52`

**Guide**: `docs/credentials-django.md`

### 2. Database (PostgreSQL)
- **DB_NAME** - Database name (e.g., `returnshield`)
- **DB_USER** - Database username
- **DB_PASSWORD** - Database password
- **DB_HOST** - Database host (`db` for Docker, `localhost` for local)
- **DB_PORT** - Usually `5432`

**Guide**: `docs/credentials-database.md`

**Note**: If using Docker, this is already configured!

---

## 🔴 Essential (Required for Core Features)

### 3. Stripe (Payment Processing)
- **STRIPE_SECRET_KEY** - From Stripe Dashboard → Developers → API keys
- **STRIPE_WEBHOOK_SECRET** - From Stripe Dashboard → Developers → Webhooks
- **STRIPE_PRICE_LAUNCH** - Create product in Stripe, copy Price ID
- **STRIPE_PRICE_SCALE** - Create product in Stripe, copy Price ID
- **STRIPE_PRICE_ELITE** - Create product in Stripe, copy Price ID

**Guide**: `docs/credentials-stripe.md`

**Time Required**: ~30 minutes

### 4. Shopify (Ecommerce Integration)
- **SHOPIFY_CLIENT_ID** - From Shopify Partners → Your App → API credentials
- **SHOPIFY_CLIENT_SECRET** - From Shopify Partners → Your App → API credentials

**Guide**: `docs/credentials-shopify.md`

**Time Required**: ~20 minutes

### 5. SendGrid (Email Sending)
- **SENDGRID_API_KEY** - From SendGrid Dashboard → Settings → API Keys
- **SENDGRID_FROM_EMAIL** - Your verified sender email (e.g., `concierge@returnshield.app`)
- **SENDGRID_FROM_NAME** - Display name (e.g., `ReturnShield Concierge`)

**Guide**: `docs/credentials-sendgrid.md`

**Time Required**: ~15 minutes

### 6. PostHog (Analytics)
- **POSTHOG_API_KEY** - From PostHog Dashboard → Project Settings
- **POSTHOG_HOST** - Your PostHog URL (e.g., `https://analytics.returnshield.app` or `https://us.posthog.com`)
- **VITE_POSTHOG_KEY** - Same as API key (for frontend)

**Guide**: `docs/credentials-posthog.md`

**Time Required**: ~10 minutes

---

## 🟡 Optional (Nice to Have)

### 7. HelpScout (Customer Support)
- **HELPSCOUT_APP_ID** - From HelpScout → Settings → Custom Apps
- **HELPSCOUT_APP_SECRET** - From HelpScout → Settings → Custom Apps
- **HELPSCOUT_MAILBOX_ID** - From HelpScout → Mailboxes → Your mailbox

**Guide**: `docs/credentials-helpscout.md`

**Note**: App works without this, but support features won't be available.

**Time Required**: ~20 minutes

---

## 📋 Complete Checklist

### Immediate Setup (Can do now):
- [ ] Generate Django Secret Key
- [ ] Set Django Debug mode
- [ ] Configure Allowed Hosts
- [ ] Set up Database (if not using Docker)

### Stripe Setup:
- [ ] Create Stripe account
- [ ] Get API keys (Secret + Publishable)
- [ ] Create 3 products (Launch, Scale, Elite)
- [ ] Get Price IDs for each product
- [ ] Set up webhook endpoint
- [ ] Get webhook secret

### Shopify Setup:
- [ ] Create Shopify Partner account
- [ ] Create Shopify app
- [ ] Get Client ID and Secret
- [ ] Configure app scopes
- [ ] Set callback URLs

### SendGrid Setup:
- [ ] Create SendGrid account
- [ ] Verify sender email/domain
- [ ] Create API key
- [ ] Test email sending

### PostHog Setup:
- [ ] Create PostHog account
- [ ] Create project
- [ ] Get API key
- [ ] Configure proxy (optional)

### HelpScout Setup (Optional):
- [ ] Create HelpScout account
- [ ] Create mailbox
- [ ] Create custom app
- [ ] Get app credentials

---

## 🚀 Quick Start Priority Order

1. **Django + Database** (5 minutes) - Get the app running
2. **Stripe** (30 minutes) - Enable billing
3. **SendGrid** (15 minutes) - Enable emails
4. **PostHog** (10 minutes) - Enable analytics
5. **Shopify** (20 minutes) - Enable integrations
6. **HelpScout** (20 minutes) - Enable support (optional)

**Total Time**: ~2 hours for complete setup

---

## 📝 Environment File Template

Create a `.env` file in the project root with:

```env
# Django
DJANGO_SECRET_KEY=your_secret_key_here
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=returnshield.app,app.returnshield.app,65.38.99.52

# Database
DB_NAME=returnshield
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db
DB_PORT=5432

# URLs
FRONTEND_URL=https://returnshield.app
APP_FRONTEND_URL=https://app.returnshield.app
BACKEND_URL=https://returnshield.app
API_URL=https://returnshield.app/api
APP_API_URL=https://returnshield.app/api

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LAUNCH=price_...
STRIPE_PRICE_SCALE=price_...
STRIPE_PRICE_ELITE=price_...

# Shopify
SHOPIFY_CLIENT_ID=...
SHOPIFY_CLIENT_SECRET=...

# SendGrid
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=concierge@returnshield.app
SENDGRID_FROM_NAME=ReturnShield Concierge

# PostHog
POSTHOG_API_KEY=phc_...
POSTHOG_HOST=https://analytics.returnshield.app
VITE_POSTHOG_KEY=phc_...

# HelpScout (Optional)
HELPSCOUT_APP_ID=...
HELPSCOUT_APP_SECRET=...
HELPSCOUT_MAILBOX_ID=...
```

---

## 🔍 Where to Find Each Guide

All detailed guides are in the `docs/` folder:

- **Code Review**: `docs/code-review-analysis.md`
- **Stripe**: `docs/credentials-stripe.md`
- **Shopify**: `docs/credentials-shopify.md`
- **SendGrid**: `docs/credentials-sendgrid.md`
- **PostHog**: `docs/credentials-posthog.md`
- **HelpScout**: `docs/credentials-helpscout.md`
- **Database**: `docs/credentials-database.md`
- **Django**: `docs/credentials-django.md`

---

## ⚠️ Important Notes

1. **Never commit `.env` files to Git** - They contain secrets!
2. **Use different credentials for dev and production**
3. **Test each integration after setup**
4. **Keep credentials secure** - Don't share them publicly
5. **Rotate keys regularly** - Especially if compromised

---

## 🆘 Need Help?

If you get stuck on any step:
1. Check the detailed guide for that service
2. Check the troubleshooting section
3. Verify environment variables are set correctly
4. Check application logs for specific errors

---

## ✅ Verification Steps

After setting up all credentials:

1. **Test Django**: `python manage.py runserver` (should start without errors)
2. **Test Database**: Check migrations run successfully
3. **Test Stripe**: Try creating a checkout session
4. **Test SendGrid**: Register a user and check for email
5. **Test PostHog**: Check dashboard for events
6. **Test Shopify**: Try the install URL endpoint

---

**Last Updated**: 2025-01-XX

