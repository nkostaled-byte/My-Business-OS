/**
 * API Configuration — Centralized Endpoint Paths
 * ================================================
 *
 * Single source of truth for all API endpoint paths.
 * No page should hardcode API URLs.
 */

export const API = {
  // Health & Debug
  health: '/api/health',
  debug: '/api/debug/supabase',

  // Public endpoints
  public: {
    site: '/api/public/site',
    availability: '/api/public/availability',
  },

  // Dashboard CRUD resources
  dashboard: {
    resource: (resource: string) => `/api/dashboard/${resource}`,
    resourceById: (resource: string, id: string) => `/api/dashboard/${resource}/${id}`,
    resourceStatus: (resource: string, id: string) => `/api/dashboard/${resource}/${id}/status`,
    metrics: '/api/dashboard/metrics',
  },

  // Auth
  claim: {
    account: '/api/claim-account',
    relink: '/api/claim-account/relink',
  },

  // Search
  search: '/api/search',

  // Upload
  upload: '/api/upload',

  // Orders (public checkout)
  orders: '/api/orders',

  // Bookings (public scheduling)
  bookings: '/api/bookings',

  // Invoices
  invoices: '/api/invoices',
  invoiceSend: (id: string) => `/api/invoices/${id}/send`,

  // Export
  export: (table: string) => `/api/export/${table}`,

  // Supported dashboard resources
  resources: [
    'products',
    'customers',
    'bookings',
    'orders',
    'invoices',
    'submissions',
    'services',
    'staff',
    'gallery',
    'reviews',
    'clients',
  ],
};

export type DashboardResource = 'products' | 'customers' | 'bookings' | 'orders' | 'invoices' | 'submissions' | 'services' | 'staff' | 'gallery' | 'reviews' | 'clients';
