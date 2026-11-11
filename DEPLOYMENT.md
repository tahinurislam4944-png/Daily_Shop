# Daily Shop production deployment runbook

1. Provision managed PostgreSQL and a Node.js 20+ host.
2. Configure all environment values from `.env.example` in the hosting dashboard. Generate a secret, e.g. `openssl rand -base64 48`. Never commit `.env`.
3. Set production `APP_URL`, `CORS_ORIGIN`, `DATABASE_URL`, `SESSION_COOKIE_SECURE=true`, `NODE_ENV=production`.
4. Configure domain DNS and enable platform TLS/HTTPS.
5. Deploy with `npm install`, release command `npm run db:migrate`, start command `npm start`.
6. Run `npm run db:seed` once with bootstrap admin credentials; then rotate password and bootstrap secrets.
7. Verify `/healthz`, storefront, admin, catalogue, COD order, inventory adjustment.
8. Complete payment merchant KYC; test sandbox payment callbacks and IPN; only then switch to live credentials.
9. Configure encrypted automated database backups and regularly test restore.
10. Complete privacy/terms/refund/delivery policy, support contact, monitoring, logs, browser/device QA, load and independent security testing.

Manual backup example: `pg_dump "$DATABASE_URL" --format=custom --file="daily-shop-$(date +%F).dump"`

**Go-live gate:** This source is not a deployed website and does not include merchant credentials. Domain/DNS, hosting account, merchant approval, and environment secrets must be supplied by the business owner. Before high-volume operation, add unpaid-order expiry/stock release and payment reconciliation jobs.
