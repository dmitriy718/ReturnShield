# ReturnShield Analytics

ReturnShield is a returns intelligence platform for Shopify brands. The stack is split into a Django REST API, a Vite/React marketing + dashboard shell, and infrastructure powered by Docker & PostgreSQL.

## Project Structure

- `backend/` – Django project (`core`) with `accounts` app, REST endpoints, and auth tests.
- `frontend/` – Vite + React + TypeScript marketing site served at `returnshield.app`.
- `app-frontend/` – Authenticated dashboard (React + Vite) served at `app.returnshield.app`.
- `posthog-proxy/` – Nginx reverse proxy that fronts PostHog Cloud for analytics.
- `docker-compose.yml` – Orchestrates backend, marketing frontend, dashboard frontend, PostHog proxy, and PostgreSQL for local development.

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
2. **Marketing site**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # set VITE_POSTHOG_KEY (and optional VITE_POSTHOG_HOST)
   npm run dev
   ```
3. **Dashboard**
   ```bash
   cd app-frontend
   npm install
   npm run dev
   ```

### Local Development (Docker)
1. Copy environment templates:
   ```bash
   cp backend/.env.example backend/.env
   cp backend/compose.env.example .env
   ```
   Then edit `.env` with real credentials (Postgres, Stripe, Shopify, OpenAI, SendGrid, HelpScout, PostHog, etc.). Supply `VITE_POSTHOG_KEY` for the marketing frontend.  
   - `FRONTEND_URL` → marketing site origin (e.g. `https://returnshield.app`)  
   - `APP_FRONTEND_URL` → dashboard origin (e.g. `https://app.returnshield.app`)  
   - `API_URL` / `APP_API_URL` → publicly reachable API base (e.g. `https://returnshield.app/api`)
2. Start services:
   ```bash
   docker compose up --build
   ```
   - API → `http://localhost:8000`
   - Marketing site → `http://localhost:3000`
   - Dashboard → `http://localhost:4173`
   - PostHog proxy → `http://localhost:9000`
   - PostgreSQL → `localhost:5432`

### Testing
```bash
cd backend
source .venv/bin/activate
python manage.py test
```

```bash
cd frontend
npm run build

cd ../app-frontend
npm run build
```

## Deployment Notes
- Stage 1 deploy target: IONOS VPS `65.38.99.52` (Ubuntu). Recommend Docker + Nginx reverse proxy.
- Domain ready: `returnshield.app`, `app.returnshield.app`, plus `.store`, `.io`, `.us`, `.me`.
- Nginx site: `/etc/nginx/sites-available/returnshield` proxies:  
  - `https://returnshield.app/` → marketing frontend (`127.0.0.1:8080`)  
  - `https://app.returnshield.app/` → dashboard frontend (`127.0.0.1:8081`)  
  - `https://*/api/` → Django API (`127.0.0.1:8000`)  
  - `https://analytics.returnshield.app/` → PostHog proxy (`127.0.0.1:9000`)  
  Certbot manages TLS (`certbot renew --dry-run` to check automation).
- Docker stack is supervised by `systemd` (`returnshield.service`) and runs `docker-compose up`; restart via `sudo systemctl restart returnshield.service`.

## Credentials Needed
- Shopify Partner API key & secret
- Stripe live publishable & secret keys
- Stripe price IDs for Launch / Scale / Elite plans
- OpenAI API key
- Email provider (SendGrid API key + sender details)
- HelpScout app ID/secret + mailbox ID
- Analytics (PostHog project API key + host)

## Billing & Checkout
- Configure `STRIPE_PRICE_LAUNCH`, `STRIPE_PRICE_SCALE`, and `STRIPE_PRICE_ELITE` in `backend/.env` (and Docker compose env) with subscription price IDs from Stripe. The dashboard reuses the same IDs.
- Marketing pricing CTAs call `POST /api/billing/create-checkout-session/` and redirect merchants to Stripe Checkout with a success page on the dashboard (`/billing/success`).
- Keep `FRONTEND_URL` pointing at the marketing site and `APP_FRONTEND_URL` pointing at the dashboard. Set `API_URL` / `APP_API_URL` to `https://returnshield.app/api` in production so both SPAs share the same API origin.

## Sustainability & Returnless Insights
- Marketing page now showcases landfill/carbon savings plus a returnless refund command center fed by `GET /api/returns/returnless-insights/`.
- Endpoint returns summary metrics (`annualized_margin_recovery`, `carbon_tonnes_prevented`, `landfill_lbs_prevented`, `manual_hours_reduced`), candidate SKU cards, and recommended automation steps.
- Frontend falls back to bundled insight data if the API is unreachable, then hydrates with live numbers when available.

## Shopify Integration Flow
1. Provide `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`, and `SHOPIFY_APP_URL` in `backend/.env`.
2. Authenticate in the app and call `POST /api/shopify/install-url/` with `{"shop_domain": "your-store"}`  
   (accepts either full `myshopify.com` domain or store prefix).  
   Response returns `install_url` – redirect the merchant there.
3. Shopify redirects back to `/api/shopify/callback/`, which stores the access token and marks the
   installation active. The user’s onboarding stage automatically advances to `sync`.

## License
All rights reserved. Internal use only.
