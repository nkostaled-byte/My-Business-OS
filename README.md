# My Business OS — Dashboard

A full-featured business management dashboard built with React, TypeScript, and Supabase. Manage bookings, orders, products, services, customers, staff, inventory, invoices, and more — all in one place.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite + React)               │
│  My-Business-OS/                                        │
│  ├── src/                                               │
│  │   ├── components/   (UI components)                  │
│  │   ├── pages/        (Route pages)                    │
│  │   ├── context/      (React contexts)                 │
│  │   ├── lib/          (API client, auth client)        │
│  │   ├── data/         (Sample data, pricing)           │
│  │   └── config/       (API configuration)              │
│  └── ...                                                │
├─────────────────────────────────────────────────────────┤
│                    Cloudflare Worker (API)               │
│  mygrafix-dashboard-worker/                             │
│  ├── worker.js         (Router entry point)             │
│  ├── handlers/         (Route handlers)                 │
│  ├── lib/              (Auth, Supabase, utils)          │
│  ├── services/         (Data access layer)              │
│  └── config/           (Constants)                      │
├─────────────────────────────────────────────────────────┤
│                    Supabase (Database + Auth)            │
│  └── PostgreSQL database with Row Level Security        │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A **Supabase** project (free tier works)
- A **Cloudflare** account (for Worker deployment)
- **wrangler** CLI (`npm install -g wrangler`)

## Environment Variables

Create a `.env` file in the project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Worker API (the deployed Cloudflare Worker URL)
VITE_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

## Quick Start

### 1. Install Dependencies

```bash
cd My-Business-OS
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app starts at `http://localhost:3000`.

### 3. Deploy the Worker

```bash
cd ../mygrafix-dashboard-worker
npm install
wrangler deploy
```

Set Worker secrets:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_JWT_SECRET
wrangler secret put R2_PUBLIC_URL
wrangler secret put RESEND_API_KEY
```

### 4. Build Frontend for Production

```bash
cd ../My-Business-OS
npm run build
```

Deploy the `dist/` folder to Cloudflare Pages or your preferred hosting.

## Authentication Flow

```
User → Google OAuth → Supabase Auth → JWT Token (ES256)
       ↓
  Worker verifies JWT via JWKS endpoint
       ↓
  Worker resolves auth_user_id → client_id from database
       ↓
  Dashboard loads with business context
```

### Session Persistence

- **Supabase session** is persisted in localStorage under key `grafix_supabase_session`
- **Business link** (client_id, businessName) is persisted under `grafix_client_id` and `grafix_business_name`
- On tab switch or page refresh, the app restores the session from localStorage
- If the Worker is unreachable (cold start), the app falls back to the persisted business link

## Project Structure

### Pages (Routes)

| Route | Page | Description |
|-------|------|-------------|
| `/` | MarketingPage | Public landing page |
| `/login` | LoginPage | Authentication |
| `/onboarding` | OnboardingPage | Create or claim a business |
| `/app` | OverviewPage | Dashboard home |
| `/app/analytics` | AnalyticsPage | Business analytics |
| `/app/orders` | OrdersPage | Order management |
| `/app/pos` | POSPage | Point of sale |
| `/app/products` | ProductsPage | Product catalog |
| `/app/services` | ServicesPage | Service menu |
| `/app/bookings` | BookingsPage | Appointment calendar |
| `/app/customers` | CustomersPage | Customer directory |
| `/app/inventory` | InventoryPage | Stock management |
| `/app/staff` | StaffPage | Team management |
| `/app/gallery` | GalleryPage | Media gallery |
| `/app/reviews` | ReviewsPage | Customer reviews |
| `/app/forms` | FormsPage | Custom form builder |
| `/app/website` | WebsiteManagerPage | Business website editor |
| `/app/invoices` | InvoicesPage | Invoice management |
| `/app/billing` | BillingPage | Subscription & billing |
| `/app/settings` | SettingsPage | Business settings |

### Key Libraries

| Library | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing |
| `@supabase/supabase-js` | Supabase Auth client |
| `recharts` | Charts and analytics |
| `lucide-react` | Icons |
| `motion` | Animations |
| `tailwindcss` | Styling |

## API Endpoints

The Cloudflare Worker exposes these endpoints:

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/health` | No | Worker health check |
| GET | `/api/debug/supabase` | No | Supabase connectivity test |
| GET | `/api/public/site` | No | Public business site data |
| GET | `/api/public/availability` | No | Public booking availability |
| GET | `/api/claim-account/status` | Yes | Check business link status |
| POST | `/api/claim-account` | Yes | Create new business |
| POST | `/api/claim-account/relink` | Yes | Claim existing business |
| GET | `/api/dashboard/*` | Yes | Dashboard data |
| GET | `/api/search` | Yes | Global search |
| POST | `/api/upload` | Yes | File upload to R2 |
| POST | `/api/orders` | Yes | Create order |
| POST | `/api/bookings` | Yes | Create booking |
| POST | `/api/invoices` | Yes | Create invoice |
| POST | `/api/invoices/:id/send` | Yes | Send invoice email |
| GET | `/api/export/:type` | Yes | Export data (CSV/PDF) |

## Database Schema

The Supabase database uses these key tables:

- **clients** — Business accounts (client_id, business_name, auth_user_id, ...)
- **team_members** — Staff linked to businesses
- **products** — Product catalog
- **services** — Service menu
- **bookings** — Appointments
- **orders** — Customer orders
- **invoices** — Billing records
- **customers** — Customer directory
- **inventory** — Stock items
- **reviews** — Customer feedback
- **forms** — Custom form definitions
- **form_submissions** — Form entry data

## Troubleshooting

### "Cannot read properties of undefined (reading 'client')"

**Cause:** The API client returns the Worker response body directly (not nested under `.data`), but the code was reading `result.data`.

**Fix:** Ensure all API calls read properties directly from `result` (e.g., `result.client`, `result.status`), not `result.data`.

### Tab switch redirects to onboarding

**Cause:** When switching browser tabs, the app re-mounts and calls `initializeAuth()`. If the Worker is cold-starting, the `checkClientLink()` call fails, and `clientId` is null.

**Fix:** The app now persists `clientId` and `businessName` in localStorage. On Worker failure, it falls back to the persisted values.

### JWT verification fails

**Cause:** The Worker's JWKS URL was incorrect (missing `/auth/v1/` path segment).

**Fix:** The JWKS URL is now derived as `{SUPABASE_URL}/auth/v1/.well-known/jwks.json`.

## Deployment

### Frontend (Cloudflare Pages)

```bash
npm run build
# Upload dist/ folder to Cloudflare Pages
```

### Worker (Cloudflare Workers)

```bash
cd ../mygrafix-dashboard-worker
wrangler deploy
```

### Database Migrations

```bash
# Apply SQL migrations via Supabase dashboard SQL editor
# Files in mygrafix-dashboard-worker/*.sql
```

## Development

### Running Locally

```bash
# Terminal 1: Frontend
cd My-Business-OS
npm run dev

# Terminal 2: Worker (local)
cd ../mygrafix-dashboard-worker
wrangler dev
```

### Testing

```bash
# Run the test scripts
cd ..
.\test_flow.ps1
.\send_test_request.ps1
```

## License

Proprietary — All rights reserved.
