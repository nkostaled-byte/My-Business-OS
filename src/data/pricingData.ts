import { api } from '../lib/api-client';

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number; // per month when billed annually
  monthlyBillingText: string;
  yearlyBillingText: string;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  features: string[];
  includedFromPrevious: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Start today, upgrade when you grow',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyBillingText: 'Free forever',
    yearlyBillingText: 'Free forever',
    features: [
      'Orders',
      'Customers (CRM)',
      'Bookings & Appointments',
      'Overview Dashboard',
    ],
    includedFromPrevious: '',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Small businesses & solo creators',
    monthlyPrice: 99,
    yearlyPrice: 79,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R948 billed annually',
    features: [
      'Website Dashboard',
      'CRM (Customers)',
      'Products & Services',
      'POS & Orders',
      'Bookings & Appointments',
      'Contact Forms',
      'Basic Analytics',
    ],
    includedFromPrevious: '',
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Growing brands & salons',
    monthlyPrice: 249,
    yearlyPrice: 199,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R2,388 billed annually',
    badge: 'Most Popular',
    isPopular: true,
    features: [
      'Team Members & Staff Access',
      'Invoices & PDFs',
      'Website Manager',
      'Online Bookings & E-Commerce',
      'Gallery & Reviews',
      'Reports & Exports',
      'Custom Branding',
    ],
    includedFromPrevious: 'Everything in Starter +',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Scaling service & product businesses',
    monthlyPrice: 549,
    yearlyPrice: 439,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R5,268 billed annually',
    badge: 'Best Value',
    isBestValue: true,
    features: [
      'Inventory Tracking',
      'Advanced Analytics',
      'Priority Support',
    ],
    includedFromPrevious: 'Everything in Business +',
  },
];

export const HOSTING_PLANS: PricingPlan[] = [
  {
    id: 'hosting-basic',
    name: 'Basic Hosting',
    tagline: 'For single websites & personal sites',
    monthlyPrice: 99,
    yearlyPrice: 79,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R948 billed annually',
    features: ['1 Website', 'Unlimited file storage', 'Free SSL Certificate', 'Business Email', 'Basic Support'],
    includedFromPrevious: '',
  },
  {
    id: 'hosting-pro',
    name: 'Pro Hosting',
    tagline: 'For growing sites with higher traffic',
    monthlyPrice: 199,
    yearlyPrice: 159,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R1,908 billed annually',
    badge: 'Most Popular',
    isPopular: true,
    features: [
      'Unlimited Websites',
      'Unlimited file storage',
      'Free SSL Certificates',
      'Business Email',
      'Daily Backups',
      'Priority Support',
    ],
    includedFromPrevious: 'Everything in Basic +',
  },
];

export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  try {
    const res = await api.getPlans();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data as PricingPlan[];
    }
  } catch {
    // Fallback to static configuration if the worker endpoint is unconfigured
  }
  return PRICING_PLANS;
}
