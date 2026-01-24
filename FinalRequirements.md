# Final Requirements for Production Deployment

The following secrets and configurations are required to fully activate the production environment on the VPS.

## Missing Secrets (Environment Variables)

### Backend (.env)
- `DJANGO_SECRET_KEY`: Must be a high-entropy random string (e.g., generated via `openssl rand -base64 32`).
- `STRIPE_SECRET_KEY`: Live Secret Key from Stripe Dashboard.
- `STRIPE_PUBLISHABLE_KEY`: Live Publishable Key.
- `STRIPE_WEBHOOK_SECRET`: Secret for the webhook endpoint `https://returnshield.app/api/billing/webhook/`.
- `SENDGRID_API_KEY`: API Key with mail send permissions.
- `HELPSCOUT_APP_ID`: App ID for the HelpScout integration.
- `HELPSCOUT_APP_SECRET`: App Secret.
- `POSTHOG_API_KEY`: Project API Key for backend analytics.
- `EASYPOST_API_KEY`: Live Production Key for shipping label generation.

### Frontend (.env / Build Args)
- `VITE_POSTHOG_KEY`: Public Project API Key for frontend analytics.
- `VITE_STRIPE_PUBLISHABLE_KEY`: Same as backend.

## Deployment Access
- **SSH Access**: Password for `root@203.0.113.52` is required to pull the latest code and restart Docker services.
- **DNS Configuration**: Ensure `returnshield.app` and `app.returnshield.app` point to `203.0.113.52`.

## Manual Steps Required
1. SSH into VPS.
2. Navigate to project directory.
3. `git pull origin master`
4. Update `.env` with the secrets above.
5. `docker compose -f docker-compose.yml up -d --build`
6. Run migrations: `docker compose exec backend python manage.py migrate`
7. Collect static: `docker compose exec backend python manage.py collectstatic --noinput`
