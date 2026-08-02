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
    id: 'starter',
    name: 'Starter',
    tagline: 'Small businesses & solo creators',
    monthlyPrice: 19,
    yearlyPrice: 15,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R180 billed annually',
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
    monthlyPrice: 49,
    yearlyPrice: 39,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R468 billed annually',
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
    monthlyPrice: 99,
    yearlyPrice: 79,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R948 billed annually',
    badge: 'Best Value',
    isBestValue: true,
    features: [
      'Inventory Tracking',
      'Advanced Analytics',
      'Priority Support',
    ],
    includedFromPrevious: 'Everything in Business +',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Large brands & high-volume businesses',
    monthlyPrice: 199,
    yearlyPrice: 159,
    monthlyBillingText: 'Billed monthly',
    yearlyBillingText: 'R1,908 billed annually',
    features: [
      'API Access',
      'Unlimited Staff',
      'Dedicated Support',
    ],
    includedFromPrevious: 'Everything in Professional +',
  },
];

export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  try {
    const res = await fetch('/api/pricing');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // Fallback to static configuration if worker endpoint is unconfigured
  }
  return PRICING_PLANS;
}
