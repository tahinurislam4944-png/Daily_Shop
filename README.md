# Daily Shop v2 — Full-stack grocery commerce

The ZIP includes the original Daily Shop light-green storefront plus a Node.js/Express backend, PostgreSQL schema, stock-aware checkout, admin dashboard, inventory ledger, sales analytics, and SSLCommerz hosted-payment integration hooks.

## Included
- Responsive storefront: categories, search, product catalogue, basket, checkout, newsletter.
- PostgreSQL entities: admins, customers, products, orders, order items, payments, inventory movements, subscribers and sessions.
- Backend: validated JSON API, database transactions, parameterized SQL, row locks for stock, rate limits, Helmet security headers, bcrypt admin passwords, secure session settings and CSRF checks on admin write routes.
- Admin dashboard: overview, product create/edit/archive, order status management, stock adjustments and sales/category analytics.
- Payments: SSLCommerz hosted checkout + server-side transaction validation/IPN callbacks. Merchant must enable bKash, Nagad, Rocket and card channels.

## Local setup
Requirements: Node.js 20+ and PostgreSQL 14+ (Docker is optional).
1. Extract ZIP; open `daily-shop` folder.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL`, `SESSION_SECRET` (32+ random characters), `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (12+ characters).
4. Start PostgreSQL: `docker compose up -d db` (requires Docker), or use your own PostgreSQL service.
5. Run `npm install`.
6. Run `npm run db:migrate`.
7. Run `npm run db:seed` once to create the first admin and sample products.
8. Run `npm run dev`.
9. Storefront: http://localhost:3000 ; Admin: http://localhost:3000/admin

## Payments and honest launch boundary
The gateway code is implemented for SSLCommerz's hosted checkout and validation flow. Real payments cannot be switched on by code alone. You must complete merchant onboarding/KYC, settlement account setup, and obtain Store ID/Store Password. Keep `SSLCOMMERZ_IS_LIVE=false` for sandbox testing. Add credentials only to server environment secrets, never to browser code or Git. The merchant account must have the requested wallet/card channels enabled. The gateway decides which payment instruments are available on its hosted page. Daily Shop does not collect or store card numbers, CVV, PIN or OTP.

## Production launch checklist
This is a deployable source project, not an already hosted store. Domain purchase, DNS, cloud deployment, merchant approval and secret credentials require the owner.
- Deploy Node 20+ app and managed PostgreSQL; restrict DB network access.
- Set `NODE_ENV=production`, `APP_URL=https://your-domain`, `CORS_ORIGIN=https://your-domain`, `SESSION_COOKIE_SECURE=true`, unique strong `SESSION_SECRET`, and production `DATABASE_URL`.
- Enable HTTPS and force redirects at host/reverse proxy.
- Run migrations; seed admin once; rotate bootstrap password; never commit `.env`.
- Set live gateway credentials only after sandbox validation and merchant approval.
- Configure encrypted daily backups, retention, monitoring, log alerts and test database restore.
- Add legal/privacy/refund/delivery terms, real support contact, serviceable delivery areas, tax/accounting settings.
- Conduct device/browser QA, payment callback/IPN/reconciliation tests, load tests and independent security review before public orders.

## Operational limitations to resolve before high-volume launch
- No customer self-service account/order tracking, SMS/email notifications, coupon engine, automated refunds, or multi-warehouse fulfilment in this release.
- Delivery zones are not geofenced; only accept orders inside areas you can serve.
- Stock is decremented when an order is placed. Unpaid online orders need a scheduled expiry/release and payment reconciliation job before scaling.
- Refunds must be handled in the merchant portal and reconciled; the admin dashboard blocks cancelling a paid order until refund is handled.

## Commands / routes
`npm run check` syntax checks; `npm run db:migrate`; `npm run db:seed`; `npm start`.
Public API: `GET /api/health`, `GET /api/products`, `POST /api/orders`, `POST /api/newsletter`.
Admin API: `/api/admin/login`, `/me`, `/logout`, `/overview`, `/products`, `/orders`, `/analytics` plus product/stock/order mutations.
Payment callbacks: `/api/payments/success`, `/fail`, `/cancel`, `/ipn`.
