# How to Get PostHog Credentials for ReturnShield

## Overview

PostHog is used for product analytics and feature flags. You need:
1. **PostHog API Key** - For server-side tracking
2. **PostHog Project Key** - For client-side tracking (frontend)
3. **PostHog Host** - Your PostHog instance URL

---

## Step 1: Create a PostHog Account

### Option A: Use PostHog Cloud (Easiest)

1. **Go to PostHog's website**
   - Open your web browser
   - Navigate to: `https://posthog.com`
   - Click **"Start free"** or **"Sign up"**

2. **Sign up for an account**
   - Enter your email address
   - Create a password
   - Verify your email address

3. **Create your organization**
   - Enter your organization name: `ReturnShield`
   - Click **"Create organization"**

### Option B: Self-Host PostHog (Advanced)

If you prefer to self-host, follow PostHog's self-hosting guide:
- Documentation: https://posthog.com/docs/self-host

For most users, **PostHog Cloud is recommended**.

---

## Step 2: Create a Project

### 2.1 Create a New Project

1. **Go to Projects**
   - After signing up, you'll be in your organization dashboard
   - Click **"Projects"** in the left sidebar
   - OR you might see a "Create project" button

2. **Create project**
   - Click **"New project"** or **"Create project"**
   - **Project name**: `ReturnShield Production` (or `ReturnShield Development`)
   - **Time zone**: Select your timezone
   - Click **"Create project"**

3. **Select the project**
   - You'll be taken to the project dashboard
   - Make sure you're in the correct project

---

## Step 3: Get Your API Keys

### 3.1 Get Project API Key (For Backend)

1. **Go to Project Settings**
   - In the left sidebar, click **"Project"** → **"Settings"**
   - OR click the gear icon ⚙️ in the top right
   - Click **"Project Settings"**

2. **Find API Key**
   - Look for **"Project API Key"** section
   - You'll see a key that starts with `phc_` followed by a long string
   - Click the **copy icon** (looks like two overlapping squares)
   - This is your `POSTHOG_API_KEY` (for backend)

### 3.2 Get Project Key (For Frontend)

1. **Same settings page**
   - Still in Project Settings
   - Look for **"Project Key"** or **"JavaScript snippet"**
   - You'll see a key that also starts with `phc_`
   - Click the **copy icon** next to it
   - This is your `VITE_POSTHOG_KEY` (for frontend)

**Note**: Sometimes the Project API Key and Project Key are the same. That's okay!

### 3.3 Get PostHog Host

1. **Find your PostHog host**
   - If using PostHog Cloud (US): `https://us.posthog.com`
   - If using PostHog Cloud (EU): `https://eu.posthog.com`
   - If self-hosting: Your self-hosted URL (e.g., `https://analytics.returnshield.app`)

2. **For ReturnShield**
   - The code uses: `https://analytics.returnshield.app`
   - This assumes you have a PostHog proxy set up
   - OR use PostHog Cloud directly: `https://us.posthog.com`

---

## Step 4: Set Up PostHog Proxy (Optional but Recommended)

### Why Use a Proxy?

- Avoids ad blockers blocking PostHog
- Keeps analytics on your domain
- Better privacy compliance

### 4.1 Set Up Nginx Proxy

The project already includes a PostHog proxy in `posthog-proxy/`:

1. **Configure the proxy**
   - The proxy is already set up in `posthog-proxy/nginx.conf`
   - It proxies requests to PostHog Cloud

2. **Set environment variable**
   - In docker-compose.yml, set:
     ```env
     POSTHOG_CLOUD_REGION=us
     ```
   - This tells the proxy which PostHog region to use

3. **Access via your domain**
   - Use: `https://analytics.returnshield.app`
   - This is already configured in the code

---

## Step 5: Add to Your Environment

### For Backend (.env file)

Create or edit `backend/.env`:

```env
POSTHOG_API_KEY=phc_your_api_key_here
POSTHOG_HOST=https://analytics.returnshield.app
```

### For Docker Compose (.env file)

Add to your root `.env` file:

```env
POSTHOG_API_KEY=phc_your_api_key_here
POSTHOG_HOST=https://analytics.returnshield.app
POSTHOG_CLOUD_REGION=us
POSTHOG_PROXY_PORT=9000
```

### For Frontend (docker-compose.yml environment)

The frontend needs:

```env
VITE_POSTHOG_KEY=phc_your_project_key_here
VITE_POSTHOG_HOST=https://analytics.returnshield.app
```

---

## Step 6: Test PostHog Integration

### 6.1 Test Backend Tracking

1. **Start your backend**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Trigger an event**
   - Register a new user
   - OR make an API call that triggers PostHog tracking

3. **Check PostHog**
   - Go to PostHog dashboard
   - Click **"Activity"** or **"Events"** in the left sidebar
   - You should see events appearing

### 6.2 Test Frontend Tracking

1. **Start your frontend**
   ```bash
   cd app-frontend
   npm run dev
   ```

2. **Navigate the app**
   - Visit different pages
   - Click buttons
   - Perform actions

3. **Check PostHog**
   - Go to PostHog dashboard
   - Click **"Activity"** or **"Live events"**
   - You should see page views and events

---

## Step 7: Understanding PostHog Features

### Events

PostHog tracks events like:
- `user_signed_up`
- `onboarding_stage_updated`
- `subscription_plan_activated`
- `page_view`

### User Identification

PostHog identifies users by:
- User ID (from your database)
- Email address
- Custom properties

### Feature Flags (Optional)

PostHog also supports feature flags:
- Go to **"Feature flags"** in PostHog
- Create flags to enable/disable features
- The code already supports this via `FeatureFlagsView`

---

## Troubleshooting

### Problem: "PostHog API key not set" error

**Solution**: 
- Verify `POSTHOG_API_KEY` is set in environment variables
- Make sure it starts with `phc_`
- Check for typos or extra spaces

### Problem: Events not appearing in PostHog

**Solution**:
- Check PostHog dashboard → Activity
- Verify API key is correct
- Check backend logs for PostHog errors
- Make sure PostHog host is accessible

### Problem: Frontend events not tracking

**Solution**:
- Verify `VITE_POSTHOG_KEY` is set
- Check browser console for errors
- Verify PostHog host is accessible
- Check if ad blockers are blocking PostHog

### Problem: Proxy not working

**Solution**:
- Verify PostHog proxy container is running
- Check nginx.conf configuration
- Verify POSTHOG_CLOUD_REGION is set correctly
- Check proxy logs: `docker logs returnshield_posthog_proxy`

---

## Security Best Practices

1. **Never commit API keys to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables only

2. **Use different projects for dev/prod**
   - Create separate PostHog projects
   - Use different API keys for each environment

3. **Restrict API key access**
   - PostHog API keys have full access
   - Rotate keys if compromised
   - Monitor usage regularly

---

## Additional Resources

- **PostHog Documentation**: https://posthog.com/docs
- **PostHog API Reference**: https://posthog.com/docs/api
- **PostHog Self-Hosting**: https://posthog.com/docs/self-host
- **PostHog Feature Flags**: https://posthog.com/docs/feature-flags

---

## Quick Reference Checklist

- [ ] Created PostHog account
- [ ] Created a project
- [ ] Got Project API Key (`phc_...`) for backend
- [ ] Got Project Key (`phc_...`) for frontend
- [ ] Determined PostHog host URL
- [ ] Set up PostHog proxy (optional)
- [ ] Added API keys to environment variables
- [ ] Added PostHog host to environment variables
- [ ] Tested backend tracking
- [ ] Tested frontend tracking
- [ ] Verified events appear in PostHog dashboard

---

## Current Configuration in Code

### Backend (`backend/analytics/posthog.py`)

```python
POSTHOG_API_KEY = os.getenv("POSTHOG_API_KEY")
POSTHOG_HOST = os.getenv("POSTHOG_HOST", "https://analytics.returnshield.app")
```

### Frontend (`app-frontend/src/lib/posthog.ts`)

```typescript
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://analytics.returnshield.app'
```

---

**Last Updated**: 2025-01-XX

