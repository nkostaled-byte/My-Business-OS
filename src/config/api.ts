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

  // Leads / CRM (Lead Generation module)
  leads: {
    list: '/api/leads',
    create: '/api/leads',
    byId: (id: string) => `/api/leads/${id}`,
    status: (id: string) => `/api/leads/${id}/status`,
    convert: (id: string) => `/api/leads/${id}/convert`,
    pipeline: '/api/leads/pipeline',
    stages: '/api/leads/stages',
    stageById: (id: string) => `/api/leads/stages/${id}`,
    tags: '/api/leads/tags',
    tagById: (id: string) => `/api/leads/tags/${id}`,
    companies: '/api/leads/companies',
    companyById: (id: string) => `/api/leads/companies/${id}`,
    contacts: '/api/leads/contacts',
    contactById: (id: string) => `/api/leads/contacts/${id}`,
    notes: (id: string) => `/api/leads/${id}/notes`,
    noteById: (id: string, noteId: string) => `/api/leads/${id}/notes/${noteId}`,
    activities: (id: string) => `/api/leads/${id}/activities`,
    tasks: (id: string) => `/api/leads/${id}/tasks`,
    taskById: (id: string, taskId: string) => `/api/leads/${id}/tasks/${taskId}`,
    followups: (id: string) => `/api/leads/${id}/followups`,
    followupById: (id: string, followId: string) => `/api/leads/${id}/followups/${followId}`,
    scan: '/api/leads/scan',
    audit: '/api/leads/audit',
    findBusinesses: '/api/leads/find-businesses',
    searchBusinesses: '/api/leads/search/businesses',
    bulk: '/api/leads/bulk',
    export: '/api/leads/export',
  },

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
