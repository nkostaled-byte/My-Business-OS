# Integration Progress

## Phase 3: Auth & Routing
- [x] Update `src/App.tsx` — Auth-aware routing with session restore
- [x] Rewrite `src/pages/LoginPage.tsx` — Real Supabase OAuth + email login
- [x] Complete `src/pages/OnboardingPage.tsx` — Business setup wizard with create/claim flows
- [x] Update `src/App.tsx` — Add onboarding route + BusinessGuard for client_id check

## Phase 4: Dashboard Pages
- [x] OverviewPage — Connected via DataContext, real Worker API
- [x] Header — Search with 300ms debounce via `/api/search`
- [x] ProductsPage — Connected via DataContext CRUD wrappers
- [x] OrdersPage — Connected via DataContext CRUD wrappers
- [x] BookingsPage — Connected via DataContext, no mock fallback
- [x] CustomersPage — Connected via DataContext CRUD wrappers
- [x] ServicesPage — Connected via DataContext CRUD wrappers
- [x] StaffPage — Connected via DataContext CRUD wrappers
- [x] GalleryPage — Connected via DataContext CRUD wrappers
- [x] ReviewsPage — Connected via DataContext
- [x] FormsPage — Connected via DataContext, no mock fallback
- [x] InvoicesPage — Connected via DataContext CRUD wrappers
- [x] InventoryPage — Connected via DataContext (derived from products)
- [x] POSPage — Connected via DataContext
- [x] AnalyticsPage — Connected via DataContext
- [x] SettingsPage — Connected (localStorage for UI prefs)
- [x] WebsiteManagerPage — Connected (via DataContext business info)
- [x] BillingPage — Static pricing page (no API required)

## Phase 5: Search, Export, Upload
- [x] Header search → `/api/search?q=` with 300ms debounce
- [x] ExportDropdown → `/api/export/:table` CSV download
- [x] ImageUploadInput → `/api/upload?folder=xxx` real upload

## Phase 6: Data Layer
- [x] `api-client.ts` — Complete with get, post, put, patch, del, upload, exportCsv, healthCheck
- [x] `auth-client.ts` — Complete with Google OAuth, email sign in/up, claim account
- [x] `DataContext.tsx` — Complete CRUD via api-client, + convenience wrappers

## Phase 7: Bug Fixes & Deployment
- [x] Remove demo toggle from Header, OverviewPage
- [x] Remove mock data fallbacks from BookingsPage, FormsPage
- [x] Fix: Products creation 500 (category→category_id mapping) — Worker code updated
- [x] Fix: Services creation 500 (missing DB columns) — migration created
- [x] Fix: Metrics endpoint 500 (submissions uses submission_id not id) — Worker code updated
- [x] Fix: Image upload reading wrong path — ImageUploadInput.tsx updated
- [x] SQL migration created: `fix_schema_migration.sql` (run in Supabase SQL Editor)
- [ ] Deploy Worker changes to Cloudflare (`wrangler deploy`)
- [ ] Run SQL migration in Supabase SQL Editor
- [ ] Test all Worker endpoints — See `test_all_endpoints.js` (Node.js) and `test_comprehensive.ps1` (PowerShell) in project root.
- [ ] Produce completion report — See `COMPLETION_REPORT.md` in project root.
