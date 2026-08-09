/**
 * DataContext — Single Source of Truth for Dashboard Data
 * =========================================================
 *
 * All dashboard pages consume data through this context.
 * No page makes independent API calls for CRUD operations.
 *
 * Responsibilities:
 *   - Loading state management
 *   - Data refresh / revalidation
 *   - CRUD operations via api-client
 *   - Error handling
 *   - Profile/business metadata from localStorage (UI prefs only)
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import api from '../lib/api-client';
import { DashboardResource } from '../config/api';
import { subscribeToAuth } from '../lib/auth-client';
import { SubscriptionStatus } from '../lib/api-client';
import { PLAN_TIERS, PLAN_NAMES, getPlanTier } from '../config/plans';
import {
  DashboardStats,
  RevenueDataPoint,
  BookingOverviewData,
  Order,
  Booking,
  Product,
  Service,
  Customer,
  StaffMember,
  GalleryItem,
  Review,
  FormSubmission,
  Invoice,
  ActivityItem,
  BusinessHealth,
} from '../types';

// ─── Context Type ─────────────────────────────────────────────────

interface DataContextType {
  // Loading & Refresh
  isLoading: boolean;
  refreshAll: () => Promise<void>;
  refreshResource: (resource: DashboardResource) => Promise<void>;

  // Dashboard Metrics
  stats: DashboardStats | null;
  metricsLoading: boolean;
  revenueData: RevenueDataPoint[];
  bookingsOverview: BookingOverviewData | null;
  activities: ActivityItem[];
  todayBookings: Booking[];
  businessHealth: BusinessHealth | null;

  // Resource Data & Loading States
  products: Product[];
  productsLoading: boolean;
  services: Service[];
  servicesLoading: boolean;
  orders: Order[];
  ordersLoading: boolean;
  bookings: Booking[];
  bookingsLoading: boolean;
  customers: Customer[];
  customersLoading: boolean;
  staff: StaffMember[];
  staffLoading: boolean;
  gallery: GalleryItem[];
  galleryLoading: boolean;
  reviews: Review[];
  reviewsLoading: boolean;
  forms: FormSubmission[];
  formsLoading: boolean;
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  invoicesLoading: boolean;
  inventory: Array<{
    id: string;
    sku: string;
    productName: string;
    category: string;
    currentStock: number;
    minThreshold: number;
    unit: string;
    unitCost: number;
    status: 'normal' | 'low' | 'critical';
  }>;

  // CRUD Operations
  createResource: <T extends Record<string, unknown>>(resource: DashboardResource, data: Partial<T>) => Promise<T | null>;
  updateResource: <T extends Record<string, unknown>>(resource: DashboardResource, id: string, data: Partial<T>) => Promise<boolean>;
  deleteResource: (resource: DashboardResource, id: string) => Promise<boolean>;

  // Convenience Wrappers (return null on failure — caller checks)
  addProduct: (data: Partial<Product>) => Promise<Product | null>;
  addOrder: (data: Partial<Order>) => Promise<Order | null>;
  addCustomer: (data: Partial<Customer>) => Promise<Customer | null>;
  addInvoice: (data: Partial<Invoice>) => Promise<Invoice | null>;
  addService: (data: Partial<Service>) => Promise<Service | null>;
  addStaff: (data: Partial<StaffMember>) => Promise<StaffMember | null>;
  addGalleryItem: (data: Partial<GalleryItem>) => Promise<GalleryItem | null>;

  // Profile / Business metadata (localStorage only for UI)
  businessName: string;
  setBusinessName: (name: string) => void;
  businessLogo: string;
  setBusinessLogo: (logo: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  profileEmail: string;
  setProfileEmail: (email: string) => void;
  profileAvatar: string;
  setProfileAvatar: (avatar: string) => void;
  
  // Website settings (cached until logout/refresh)
  websiteSettings: {
    businessName: string;
    phone: string;
    address: string;
    openingHours: string;
    ownerEmail: string;
    websiteUrl: string;
  } | null;
  websiteSettingsLoading: boolean;
  refreshWebsiteSettings: () => Promise<void>;
  updateWebsiteSettings: (settings: Partial<{
    businessName: string;
    phone: string;
    address: string;
    openingHours: string;
    ownerEmail: string;
    websiteUrl: string;
  }>) => Promise<boolean>;

  // Subscription / plan gating
  subscription: SubscriptionStatus | null;
  subscriptionLoading: boolean;
  refreshSubscription: () => Promise<void>;
  plan: string;
  planName: string;
  planTier: number;
  canAccess: (requiredPlan: string) => boolean;
}

// ─── Resource Fetch Helpers ───────────────────────────────────────

async function fetchResource<T>(resource: DashboardResource, signal?: AbortSignal): Promise<T[]> {
  const result = await api.get<T[]>(`/api/dashboard/${resource}`, { signal });
  if (result.success && result.data) {
    return result.data;
  }
  if (result.error) {
    console.warn(`[DataContext] fetch ${resource}: ${result.error}`);
  }
  return [];
}

async function fetchMetrics(signal?: AbortSignal) {
  const result = await api.get<Record<string, unknown>>('/api/dashboard/metrics', { signal });
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}

async function fetchSubscription(signal?: AbortSignal) {
  const result = await api.get<SubscriptionStatus>('/api/paystack/status', { signal });
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}

// ─── Context ──────────────────────────────────────────────────────

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global loading state
  const [isLoading, setIsLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const initialFetchDone = useRef(false);

  // Dashboard Metrics
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [bookingsOverview, setBookingsOverview] = useState<BookingOverviewData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [businessHealth, setBusinessHealth] = useState<BusinessHealth | null>(null);

  // Resource States
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Subscription / plan gating
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const refreshSubscription = useCallback(async () => {
    setSubscriptionLoading(true);
    const data = await fetchSubscription();
    setSubscription(data);
    setSubscriptionLoading(false);
    return;
  }, []);

  // Effective plan — a lapsed/cancelled subscription downgrades to Free
  const plan = subscription && subscription.subscription_active ? subscription.plan : 'free';
  const planTier = getPlanTier(plan);
  const planName = PLAN_NAMES[plan] || plan;

  const canAccess = useCallback(
    (requiredPlan: string): boolean => getPlanTier(requiredPlan) <= planTier,
    [planTier]
  );

  // Derived inventory from products
  const inventory = products.map((p) => {
    const minThreshold = (p as any).lowStockWarning ?? 10;
    return {
      id: p.id,
      sku: p.sku,
      productName: p.name,
      category: p.category,
      currentStock: p.stock,
      minThreshold,
      unit: 'units',
      unitCost: p.costPrice || 0,
      status: (p.stock > minThreshold ? 'normal' : p.stock > 0 ? 'low' : 'critical') as 'normal' | 'low' | 'critical',
    };
  });

  // Profile / Business metadata (localStorage only)
  const [businessName, setBusinessNameState] = useState<string>(
    localStorage.getItem('my_business_name') || 'My Business OS'
  );
  const [businessLogo, setBusinessLogoState] = useState<string>(
    localStorage.getItem('my_business_logo') || ''
  );
  const [profileName, setProfileNameState] = useState<string>(
    localStorage.getItem('my_profile_name') || 'Business Owner'
  );
  const [profileEmail, setProfileEmailState] = useState<string>(
    localStorage.getItem('my_profile_email') || ''
  );
  const [profileAvatar, setProfileAvatarState] = useState<string>(
    localStorage.getItem('my_profile_avatar') || ''
  );

  const setBusinessName = (val: string) => {
    setBusinessNameState(val);
    localStorage.setItem('my_business_name', val);
  };
  const setBusinessLogo = (val: string) => {
    setBusinessLogoState(val);
    localStorage.setItem('my_business_logo', val);
  };
  const setProfileName = (val: string) => {
    setProfileNameState(val);
    localStorage.setItem('my_profile_name', val);
  };
  const setProfileEmail = (val: string) => {
    setProfileEmailState(val);
    localStorage.setItem('my_profile_email', val);
  };
  const setProfileAvatar = (val: string) => {
    setProfileAvatarState(val);
    localStorage.setItem('my_profile_avatar', val);
  };

  // Website settings (cached until logout/refresh)
  const [websiteSettings, setWebsiteSettings] = useState<{
    businessName: string;
    phone: string;
    address: string;
    openingHours: string;
    ownerEmail: string;
    websiteUrl: string;
  } | null>(null);
  const [websiteSettingsLoading, setWebsiteSettingsLoading] = useState(false);

  const refreshWebsiteSettings = useCallback(async () => {
    setWebsiteSettingsLoading(true);
    try {
      const result = await api.get<any>('/api/client-settings');
      if (result.success && result.data) {
        const s = result.data;
        setWebsiteSettings({
          businessName: s.businessName ?? '',
          phone: s.phone ?? '',
          address: s.address ?? '',
          openingHours: s.openingHours ?? '',
          ownerEmail: s.ownerEmail ?? '',
          websiteUrl: s.websiteUrl ?? '',
        });
      }
    } catch (err) {
      console.error('[DataContext] Failed to load website settings:', err);
    } finally {
      setWebsiteSettingsLoading(false);
    }
  }, []);

  const updateWebsiteSettings = useCallback(async (settings: Partial<{
    businessName: string;
    phone: string;
    address: string;
    openingHours: string;
    ownerEmail: string;
    websiteUrl: string;
  }>) => {
    try {
      const result = await api.put('/api/client-settings', settings);
      if (result.success) {
        setWebsiteSettings((prev) => prev ? { ...prev, ...settings } : null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[DataContext] Failed to update website settings:', err);
      return false;
    }
  }, []);

  // ─── Fetch All Dashboard Data ─────────────────────────────────

  const fetchAllData = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    setIsLoading(true);

    try {
      const [
        metricsData,
        productsData,
        servicesData,
        ordersData,
        bookingsData,
        customersData,
        staffData,
        galleryData,
        reviewsData,
        formsData,
        invoicesData,
      ] = await Promise.all([
        fetchMetrics(signal),
        fetchResource<Product>('products', signal),
        fetchResource<Service>('services', signal),
        fetchResource<Order>('orders', signal),
        fetchResource<Booking>('bookings', signal),
        fetchResource<Customer>('customers', signal),
        fetchResource<StaffMember>('staff', signal),
        fetchResource<GalleryItem>('gallery', signal),
        fetchResource<Review>('reviews', signal),
        fetchResource<FormSubmission>('submissions', signal),
        fetchResource<Invoice>('invoices', signal),
      ]);

      if (signal.aborted) return;

      // Set metrics
      if (metricsData) {
        setStats({
          totalRevenue: (metricsData.totalRevenue as number) || 0,
          totalRevenueChangePercent: 0,
          totalOrders: (metricsData.totalOrders as number) || 0,
          totalOrdersChangePercent: 0,
          totalBookings: (metricsData.totalBookings as number) || 0,
          totalBookingsChangePercent: 0,
          newCustomers: (metricsData.totalCustomers as number) || 0,
          newCustomersChangePercent: 0,
        });

        setRevenueData((metricsData.dailySales as RevenueDataPoint[]) || []);
        setTodayBookings((metricsData.todayBookings as Booking[]) || []);
        setBusinessHealth((metricsData.businessHealth as BusinessHealth) || {
          profileCompleteness: 0,
          setupChecklist: 0,
          customerSatisfaction: 0,
          responseRate: 0,
        });
      }

      // Set all resources
      setProducts(productsData);
      setServices(servicesData);
      setOrders(ordersData);
      setBookings(
        bookingsData.map((b) => {
          const ts = (b as any).startTime;
          if (ts && !(b as any).date) {
            const d = new Date(ts);
            return {
              ...b,
              date: d.toISOString().split('T')[0],
              time: d.toTimeString().slice(0, 5),
            } as any;
          }
          return b;
        }) as Booking[]
      );
      setCustomers(customersData);
      setStaff(staffData);
      setGallery(galleryData);
      setReviews(reviewsData);
      setForms(formsData);
      setInvoices(invoicesData);

      // Build bookings overview
      const completed = bookingsData.filter((b) => b.status === 'completed').length;
      const upcoming = bookingsData.filter((b) => b.status === 'upcoming').length;
      const cancelled = bookingsData.filter((b) => b.status === 'cancelled').length;
      setBookingsOverview({ completed, upcoming, cancelled, total: bookingsData.length });

      // Build activities from recent orders and bookings
      const recentOrders = ordersData.slice(0, 3).map((o) => ({
        id: `act-order-${o.id}`,
        title: 'New order received',
        description: o.orderNumber || `Order #${o.id}`,
        timestamp: o.createdAt || new Date().toISOString(),
        type: 'order' as const,
      }));
      const recentBookings = bookingsData.slice(0, 2).map((b) => ({
        id: `act-booking-${b.id}`,
        title: 'Booking confirmed',
        description: `${b.clientName} - ${b.serviceName}`,
        timestamp: b.date || new Date().toISOString(),
        type: 'booking' as const,
      }));
      setActivities([...recentOrders, ...recentBookings]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('[DataContext] fetchAllData error:', err);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // ─── Refresh ──────────────────────────────────────────────────

  const refreshAll = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const refreshResource = useCallback(async (resource: DashboardResource) => {
    const data = await fetchResource<Record<string, unknown>>(resource);
    switch (resource) {
      case 'products': setProducts(data as unknown as Product[]); break;
      case 'services': setServices(data as unknown as Service[]); break;
      case 'orders': setOrders(data as unknown as Order[]); break;
      case 'bookings': setBookings(data as unknown as Booking[]); break;
      case 'customers': setCustomers(data as unknown as Customer[]); break;
      case 'staff': setStaff(data as unknown as StaffMember[]); break;
      case 'gallery': setGallery(data as unknown as GalleryItem[]); break;
      case 'reviews': setReviews(data as unknown as Review[]); break;
      case 'submissions': setForms(data as unknown as FormSubmission[]); break;
      case 'invoices': setInvoices(data as unknown as Invoice[]); break;
      default: break;
    }
  }, []);

  // ─── CRUD Operations ──────────────────────────────────────────

  const createResource = useCallback(async <T extends Record<string, unknown>>(
    resource: DashboardResource,
    data: Partial<T>
  ): Promise<T | null> => {
    try {
      const result = await api.post<T>(`/api/dashboard/${resource}`, data);
      if (result.success && result.data) {
        // Optimistic update: add to local state
        switch (resource) {
          case 'products': setProducts((prev) => [result.data as unknown as Product, ...prev]); break;
          case 'services': setServices((prev) => [result.data as unknown as Service, ...prev]); break;
          case 'orders': setOrders((prev) => [result.data as unknown as Order, ...prev]); break;
          case 'bookings': {
            const bk = result.data as Record<string, unknown>;
            setBookings((prev) => [{
              ...bk,
              clientName: (bk as any).clientName || data.clientName,
              clientPhone: (bk as any).clientPhone || data.clientPhone,
              serviceName: (bk as any).serviceName || data.serviceName,
              staffName: (bk as any).staffName || data.staffName,
              date: (bk as any).date || ((bk as any).startTime ? new Date((bk as any).startTime).toISOString().split('T')[0] : data.date),
              time: (bk as any).time || ((bk as any).startTime ? new Date((bk as any).startTime).toTimeString().slice(0, 5) : data.time),
              amount: (bk as any).amount ?? data.amount ?? 0,
              bookingCode: (bk as any).bookingCode || data.bookingCode || `#BK-${String((bk as any).id || '').slice(0, 4).toUpperCase()}`,
            } as unknown as Booking, ...prev]);
            break;
          }
          case 'customers': setCustomers((prev) => [result.data as unknown as Customer, ...prev]); break;
          case 'staff': setStaff((prev) => [result.data as unknown as StaffMember, ...prev]); break;
          case 'gallery': setGallery((prev) => [result.data as unknown as GalleryItem, ...prev]); break;
          case 'reviews': setReviews((prev) => [result.data as unknown as Review, ...prev]); break;
          case 'submissions': setForms((prev) => [result.data as unknown as FormSubmission, ...prev]); break;
          case 'invoices': {
            const inv = result.data as Record<string, unknown>;
            setInvoices((prev) => [{
              ...inv,
              clientName: (inv as any).clientName || data.clientName,
              clientEmail: (inv as any).clientEmail || data.clientEmail,
              amount: (inv as any).amount ?? (inv as any).total ?? 0,
              total: (inv as any).total ?? (inv as any).amount ?? 0,
            } as unknown as Invoice, ...prev]);
            break;
          }
          default: break;
        }
        return result.data;
      }
      // Log API errors to console for debugging
      console.error(`[DataContext] createResource failed for ${resource}:`, result.error || 'Unknown error');
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      console.error(`[DataContext] createResource exception for ${resource}:`, message);
      return null;
    }
  }, []);

  const updateResource = useCallback(async <T extends Record<string, unknown>>(
    resource: DashboardResource,
    id: string,
    data: Partial<T>
  ): Promise<boolean> => {
    const result = await api.put(`/api/dashboard/${resource}/${id}`, data);
    if (result.success) {
      // Refresh the resource to get updated data
      await refreshResource(resource);
      return true;
    }
    return false;
  }, [refreshResource]);

  const deleteResource = useCallback(async (
    resource: DashboardResource,
    id: string
  ): Promise<boolean> => {
    const result = await api.del(`/api/dashboard/${resource}/${id}`);
    if (result.success) {
      // Optimistic update: remove from local state
      switch (resource) {
        case 'products': setProducts((prev) => prev.filter((item) => item.id !== id)); break;
        case 'services': setServices((prev) => prev.filter((item) => item.id !== id)); break;
        case 'orders': setOrders((prev) => prev.filter((item) => item.id !== id)); break;
        case 'bookings': setBookings((prev) => prev.filter((item) => item.id !== id)); break;
        case 'customers': setCustomers((prev) => prev.filter((item) => item.id !== id)); break;
        case 'staff': setStaff((prev) => prev.filter((item) => item.id !== id)); break;
        case 'gallery': setGallery((prev) => prev.filter((item) => item.id !== id)); break;
        case 'reviews': setReviews((prev) => prev.filter((item) => item.id !== id)); break;
        case 'submissions': setForms((prev) => prev.filter((item) => item.id !== id)); break;
        case 'invoices': setInvoices((prev) => prev.filter((item) => item.id !== id)); break;
        default: break;
      }
      return true;
    }
    return false;
  }, []);

  // ─── Convenience Wrappers ────────────────────────────────────

  const addProduct = useCallback(async (data: Partial<Product>) => {
    return createResource('products', data as unknown as Record<string, unknown>) as unknown as Product | null;
  }, [createResource]);

  const addOrder = useCallback(async (data: Partial<Order>) => {
    return createResource('orders', data as unknown as Record<string, unknown>) as unknown as Order | null;
  }, [createResource]);

  const addCustomer = useCallback(async (data: Partial<Customer>) => {
    return createResource('customers', data as unknown as Record<string, unknown>) as unknown as Customer | null;
  }, [createResource]);

  const addInvoice = useCallback(async (data: Partial<Invoice>) => {
    return createResource('invoices', data as unknown as Record<string, unknown>) as unknown as Invoice | null;
  }, [createResource]);

  const addService = useCallback(async (data: Partial<Service>) => {
    return createResource('services', data as unknown as Record<string, unknown>) as unknown as Service | null;
  }, [createResource]);

  const addStaff = useCallback(async (data: Partial<StaffMember>) => {
    return createResource('staff', data as unknown as Record<string, unknown>) as unknown as StaffMember | null;
  }, [createResource]);

  const addGalleryItem = useCallback(async (data: Partial<GalleryItem>) => {
    return createResource('gallery', data as unknown as Record<string, unknown>) as unknown as GalleryItem | null;
  }, [createResource]);

  // ─── Initial Fetch When Auth Is Ready ─────────────────────────
  // Wait for auth to confirm clientId before fetching dashboard data.
  // This avoids race conditions where API calls fire before the JWT
  // token is synced into localStorage by initializeAuth().

  useEffect(() => {
    const unsubscribe = subscribeToAuth((state) => {
      if (state.clientId) {
        if (!initialFetchDone.current) {
          initialFetchDone.current = true;
          fetchAllData();
          refreshSubscription();
          refreshWebsiteSettings();
        }
      } else {
        initialFetchDone.current = false;
      }
    });
    return unsubscribe;
  }, [fetchAllData, refreshSubscription, refreshWebsiteSettings]);

  // ─── Context Value ────────────────────────────────────────────

  const value: DataContextType = {
    isLoading,
    refreshAll,
    refreshResource,
    stats,
    metricsLoading,
    revenueData,
    bookingsOverview,
    activities,
    todayBookings,
    businessHealth,
    products,
    productsLoading,
    services,
    servicesLoading,
    orders,
    ordersLoading,
    bookings,
    bookingsLoading,
    customers,
    customersLoading,
    staff,
    staffLoading,
    gallery,
    galleryLoading,
    reviews,
    reviewsLoading,
    forms,
    formsLoading,
    invoices,
    setInvoices,
    invoicesLoading,
    inventory,
    createResource,
    updateResource,
    deleteResource,
    addProduct,
    addOrder,
    addCustomer,
    addInvoice,
    addService,
    addStaff,
    addGalleryItem,
    businessName,
    setBusinessName,
    businessLogo,
    setBusinessLogo,
    profileName,
    setProfileName,
    profileEmail,
    setProfileEmail,
    profileAvatar,
    setProfileAvatar,
    websiteSettings,
    websiteSettingsLoading,
    refreshWebsiteSettings,
    updateWebsiteSettings,
    subscription,
    subscriptionLoading,
    refreshSubscription,
    plan,
    planName,
    planTier,
    canAccess,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
