# ReturnShield Analytics

ReturnShield is a returns intelligence platform for Shopify brands. The stack is split into a Django REST API, a Vite/React marketing + dashboard shell, and infrastructure powered by Docker & PostgreSQL.

## Project Structure

- `backend/` – Django project (`core`) with `accounts` app, REST endpoints, and auth tests.
- `frontend/` – Vite + React + TypeScript single-page app with premium marketing experience.
- `docker-compose.yml` – Orchestrates backend, frontend, and PostgreSQL for local development.

## Getting Started

### Prerequisites
- Python 3.12 +
- Node.js 20 +
- Docker & Docker Compose (for unified dev)

### Local Development (manual)
1. **Backend**
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env  # update secrets
   python manage.py migrate
   python manage.py runserver
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # set VITE_POSTHOG_KEY (and optional VITE_POSTHOG_HOST)
   npm run dev
   ```

### Local Development (Docker)
1. Copy environment templates:
   ```bash
   cp backend/.env.example backend/.env
   cp backend/compose.env.example .env
   ```
   Then edit `.env` with real credentials (Postgres, Stripe, Shopify, OpenAI, SendGrid, HelpScout, PostHog, etc.). Supply `VITE_POSTHOG_KEY` for the frontend when using Docker (expose it in the `frontend` service environment).
2. Start services:
   ```bash
   docker compose up --build
   ```
   - API → `http://localhost:8000`
   - Frontend → `http://localhost:3000`
   - PostgreSQL → `localhost:5432`

### Testing
```bash
cd backend
source .venv/bin/activate
python manage.py test
```

```bash
cd frontend
npm run build  # runs TypeScript + Vite checks
```

## Deployment Notes
- Stage 1 deploy target: IONOS VPS `65.38.99.52` (Ubuntu). Recommend Docker + Nginx reverse proxy.
- Domain ready: `returnshield.app`, plus `.store`, `.io`, `.us`, `.me`.

## Credentials Needed
- Shopify Partner API key & secret
- Stripe live publishable & secret keys
- Stripe price IDs for Launch / Scale / Elite plans
- OpenAI API key
- Email provider (SendGrid API key + sender details)
- HelpScout app ID/secret + mailbox ID
- Analytics (PostHog project API key + host)

## Billing & Checkout
- Configure `STRIPE_PRICE_LAUNCH`, `STRIPE_PRICE_SCALE`, and `STRIPE_PRICE_ELITE` in `backend/.env` (and Docker compose env) with subscription price IDs from Stripe.
- Frontend pricing CTAs call `POST /api/billing/create-checkout-session/` and redirect merchants to Stripe Checkout.
- Update `FRONTEND_URL` in the backend environment so success and cancel URLs resolve correctly.

## Shopify Integration Flow
1. Provide `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, and `SHOPIFY_APP_URL` in `backend/.env`.
2. Authenticate in the app and call `POST /api/shopify/install-url/` with `{"shop_domain": "your-store"}`  
   (accepts either full `myshopify.com` domain or store prefix).  
   Response returns `install_url` – redirect the merchant there.
3. Shopify redirects back to `/api/shopify/callback/`, which stores the access token and marks the
   installation active. The user’s onboarding stage automatically advances to `sync`.

## License
All rights reserved. Internal use only.
