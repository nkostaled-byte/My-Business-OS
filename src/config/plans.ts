/**
 * Plan configuration — subscription tier mapping for the dashboard UI.
 * Mirrors lib/planAccess.js on the worker and the pricing-page feature tiers.
 */

export const PLAN_TIERS: Record<string, number> = {
  free: 0,
  starter: 1,
  business: 2,
  professional: 3,
  // Kept for legacy stored values only — no longer sold or selectable.
  enterprise: 4,
};

export const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  business: 'Business',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

/**
 * Minimum plan required to access each dashboard route.
 * Any path not listed defaults to Free (available to everyone).
 * The Free tier includes Orders, Customers and Bookings.
 */
export const PAGE_MIN_PLAN: Record<string, string> = {
  '/app/analytics': 'free', // Analytics (available on Free)
  '/app/orders': 'free', // Orders
  '/app/customers': 'free', // Customers (CRM)
  '/app/bookings': 'free', // Bookings & Appointments
  '/app/pos': 'starter', // POS
  '/app/products': 'starter', // Products
  '/app/services': 'starter', // Services
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
  return (plan && PLAN_TIERS[plan]) ?? 0;
}

export function getPageMinPlan(path: string): string {
  return PAGE_MIN_PLAN[path] || 'starter';
}

export function isRouteLocked(path: string, currentPlan: string | null): boolean {
  const required = getPageMinPlan(path);
  return getPlanTier(currentPlan) < getPlanTier(required);
}
