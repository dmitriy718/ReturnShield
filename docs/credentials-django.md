# How to Configure Django Settings for ReturnShield

## Overview

Django needs several configuration values to run properly. Most are straightforward, but here's a guide for the important ones.

---

## Step 1: Django Secret Key

### What is it?

The secret key is used for cryptographic signing. It's critical for security!

### Generate a Secret Key

**Option 1: Use Django's built-in generator**

```bash
cd backend
python manage.py shell
```

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Copy the output - that's your secret key!

**Option 2: Use online generator**

- Go to: https://djecrety.ir/
- Click "Generate" button
- Copy the generated key

**Option 3: Use Python directly**

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Add to Environment

```env
DJANGO_SECRET_KEY=your_generated_secret_key_here
```

**IMPORTANT**: 
- Never commit this to Git!
- Use different keys for development and production
- Keep it secret!

---

## Step 2: Debug Mode

### What is it?

Debug mode shows detailed error pages. **NEVER use in production!**

### Configuration

**For Development:**
```env
DJANGO_DEBUG=1
```

**For Production:**
```env
DJANGO_DEBUG=0
```

### Why Disable in Production?

- Security risk (exposes code and settings)
- Performance impact
- Not user-friendly error pages

---

## Step 3: Allowed Hosts

### What is it?

List of hostnames/domains your Django app can serve.

### Configuration

**For Development:**
```env
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

**For Production:**
```env
DJANGO_ALLOWED_HOSTS=returnshield.app,www.returnshield.app,app.returnshield.app,65.38.99.52
```

### Add Your Domains

Include:
- Your main domain: `returnshield.app`
- www subdomain: `www.returnshield.app`
- App subdomain: `app.returnshield.app`
- Your VPS IP: `65.38.99.52` (if accessing via IP)

---

## Step 4: Frontend URLs

### What are they?

URLs where your frontend applications are hosted.

### Configuration

```env
FRONTEND_URL=https://returnshield.app
APP_FRONTEND_URL=https://app.returnshield.app
BACKEND_URL=https://returnshield.app
SHOPIFY_APP_URL=https://returnshield.app
```

### For Local Development:

```env
FRONTEND_URL=http://localhost:3000
APP_FRONTEND_URL=http://localhost:4173
BACKEND_URL=http://localhost:8000
SHOPIFY_APP_URL=http://localhost:3000
```

---

## Step 5: API URLs

### What are they?

Base URLs for API endpoints, used by frontend applications.

### Configuration

**For Production:**
```env
API_URL=https://returnshield.app/api
APP_API_URL=https://returnshield.app/api
```

**For Local Development:**
```env
API_URL=http://localhost:8000/api
APP_API_URL=http://localhost:8000/api
```

**Note**: Both frontend and app-frontend use the same API URL in production.

---

## Step 6: Complete Environment File

### Example Production .env

Create `backend/.env`:

```env
# Django Core
DJANGO_SECRET_KEY=your_secret_key_here
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=returnshield.app,www.returnshield.app,app.returnshield.app,65.38.99.52

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=returnshield
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=db
DB_PORT=5432

# URLs
FRONTEND_URL=https://returnshield.app
APP_FRONTEND_URL=https://app.returnshield.app
BACKEND_URL=https://returnshield.app
SHOPIFY_APP_URL=https://returnshield.app
API_URL=https://returnshield.app/api
APP_API_URL=https://returnshield.app/api

# Stripe (see credentials-stripe.md)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LAUNCH=price_...
STRIPE_PRICE_SCALE=price_...
STRIPE_PRICE_ELITE=price_...

# Shopify (see credentials-shopify.md)
SHOPIFY_CLIENT_ID=...
SHOPIFY_CLIENT_SECRET=...

# SendGrid (see credentials-sendgrid.md)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=concierge@returnshield.app
SENDGRID_FROM_NAME=ReturnShield Concierge

# PostHog (see credentials-posthog.md)
POSTHOG_API_KEY=phc_...
POSTHOG_HOST=https://analytics.returnshield.app

# HelpScout (optional, see credentials-helpscout.md)
HELPSCOUT_APP_ID=...
HELPSCOUT_APP_SECRET=...
HELPSCOUT_MAILBOX_ID=...
```

### Example Development .env

```env
# Django Core
DJANGO_SECRET_KEY=dev-secret-key-change-in-production
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database (using Docker)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=returnshield
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# URLs
FRONTEND_URL=http://localhost:3000
APP_FRONTEND_URL=http://localhost:4173
BACKEND_URL=http://localhost:8000
SHOPIFY_APP_URL=http://localhost:3000
API_URL=http://localhost:8000/api
APP_API_URL=http://localhost:8000/api

# ... rest of credentials (can use test/development keys)
```

---

## Step 7: Verify Configuration

### Test Django Settings

1. **Start Django shell**
   ```bash
   cd backend
   python manage.py shell
   ```

2. **Check settings**
   ```python
   from django.conf import settings
   print(f"DEBUG: {settings.DEBUG}")
   print(f"ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
   print(f"SECRET_KEY set: {bool(settings.SECRET_KEY)}")
   ```

3. **Test database connection**
   ```python
   from django.db import connection
   cursor = connection.cursor()
   cursor.execute("SELECT 1;")
   print("Database connection OK!")
   ```

### Run Server

```bash
python manage.py runserver
```

If it starts without errors, your configuration is correct!

---

## Troubleshooting

### Problem: "SECRET_KEY not set" warning

**Solution**: 
- Add `DJANGO_SECRET_KEY` to your `.env` file
- Make sure `.env` is being loaded (check `settings.py`)

### Problem: "DisallowedHost" error

**Solution**:
- Add your domain/IP to `DJANGO_ALLOWED_HOSTS`
- Make sure there are no spaces in the list
- Restart your server after changing

### Problem: CORS errors in browser

**Solution**:
- Check `FRONTEND_URL` and `APP_FRONTEND_URL` are correct
- Verify CORS settings in `settings.py`
- Make sure URLs match exactly (including http/https)

### Problem: Environment variables not loading

**Solution**:
- Make sure `.env` file is in `backend/` directory
- Check that `python-dotenv` is installed
- Verify `load_dotenv()` is called in `settings.py`

---

## Security Checklist

- [ ] `DJANGO_SECRET_KEY` is set and secure
- [ ] `DJANGO_DEBUG=0` in production
- [ ] `DJANGO_ALLOWED_HOSTS` includes only your domains
- [ ] All API keys are in environment variables (not hardcoded)
- [ ] `.env` file is in `.gitignore`
- [ ] Different secrets for dev and production
- [ ] Database credentials are secure
- [ ] HTTPS is enabled in production

---

## Additional Resources

- **Django Settings**: https://docs.djangoproject.com/en/stable/ref/settings/
- **Django Deployment Checklist**: https://docs.djangoproject.com/en/stable/howto/deployment/checklist/
- **Environment Variables**: https://12factor.net/config

---

## Quick Reference

### Required for Basic Functionality:
- `DJANGO_SECRET_KEY` ✅
- `DJANGO_DEBUG` ✅
- `DJANGO_ALLOWED_HOSTS` ✅
- Database credentials ✅
- `FRONTEND_URL` ✅
- `APP_FRONTEND_URL` ✅

### Required for Full Functionality:
- Stripe credentials (for billing)
- Shopify credentials (for integrations)
- SendGrid credentials (for emails)
- PostHog credentials (for analytics)

### Optional:
- HelpScout credentials (for support)

---

**Last Updated**: 2025-01-XX

