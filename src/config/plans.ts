/**
 * Plan configuration — subscription tier mapping for the dashboard UI.
 * Mirrors lib/planAccess.js on the worker and the pricing-page feature tiers.
 */

export const PLAN_TIERS: Record<string, number> = {
  starter: 1,
  business: 2,
  professional: 3,
  enterprise: 4,
};

export const PLAN_NAMES: Record<string, string> = {
  starter: 'Starter',
  business: 'Business',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

/**
 * Minimum plan required to access each dashboard route.
 * Any path not listed defaults to Starter (available to everyone).
 */
export const PAGE_MIN_PLAN: Record<string, string> = {
  '/app/analytics': 'starter', // Basic Analytics
  '/app/orders': 'starter', // POS & Orders
  '/app/pos': 'starter',
  '/app/products': 'starter', // Products & Services
  '/app/services': 'starter',
  '/app/bookings': 'starter', // Bookings & Appointments
  '/app/customers': 'starter', // CRM
  '/app/forms': 'starter', // Contact Forms
  '/app/inventory': 'professional', // Inventory Tracking
  '/app/staff': 'business', // Team Members & Staff Access
  '/app/gallery': 'business', // Gallery & Reviews
  '/app/reviews': 'business',
  '/app/website': 'business', // Website Manager
  '/app/invoices': 'business', // Invoices & PDFs
  // Overview, Billing and Settings stay open to every plan
};

export function getPlanTier(plan: string | null | undefined): number {
  return (plan && PLAN_TIERS[plan]) || 1;
}

export function getPageMinPlan(path: string): string {
  return PAGE_MIN_PLAN[path] || 'starter';
}

export function isRouteLocked(path: string, currentPlan: string | null): boolean {
  const required = getPageMinPlan(path);
  return getPlanTier(currentPlan) < getPlanTier(required);
}
