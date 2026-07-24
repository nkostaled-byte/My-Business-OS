import React, { createContext, useContext, useState } from 'react';
import {
  DashboardStats,
  RevenueDataPoint,
  BookingOverviewData,
  Order,
  Booking,
  Product,
  Service,
  Customer,
  InventoryItem,
  StaffMember,
  GalleryItem,
  Review,
  FormSubmission,
  Invoice,
  ActivityItem,
  BusinessHealth,
} from '../types';
import {
  sampleStats,
  sampleRevenueData,
  sampleBookingsOverview,
  sampleActivities,
  sampleProducts,
  sampleServices,
  sampleOrders,
  sampleBookings,
  sampleCustomers,
  sampleInventory,
  sampleStaff,
  sampleGallery,
  sampleReviews,
  sampleForms,
  sampleInvoices,
  sampleBusinessHealth,
} from '../data/sampleData';

interface DataContextType {
  demoMode: boolean;
  toggleDemoMode: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  stats: DashboardStats | null;
  revenueData: RevenueDataPoint[];
  bookingsOverview: BookingOverviewData | null;
  activities: ActivityItem[];
  products: Product[];
  services: Service[];
  orders: Order[];
  bookings: Booking[];
  customers: Customer[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  gallery: GalleryItem[];
  reviews: Review[];
  forms: FormSubmission[];
  invoices: Invoice[];
  businessHealth: BusinessHealth | null;

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

  // Actions with TODO API comments
  addOrder: (order: Partial<Order>) => void;
  addProduct: (product: Partial<Product>) => void;
  addBooking: (booking: Partial<Booking>) => void;
  addService: (service: Partial<Service>) => void;
  addCustomer: (customer: Partial<Customer>) => void;
  addInvoice: (invoice: Partial<Invoice>) => void;
  addStaff: (staff: Partial<StaffMember>) => void;
  addGalleryItem: (item: Partial<GalleryItem>) => void;
  addReview: (review: Partial<Review>) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STRICT REQUIREMENT: Default state starts as empty/null/0
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [bookingsOverview, setBookingsOverview] = useState<BookingOverviewData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [businessHealth, setBusinessHealth] = useState<BusinessHealth | null>(null);

  const [businessName, setBusinessNameState] = useState<string>(
    localStorage.getItem('my_business_name') || 'My Business OS'
  );
  const [businessLogo, setBusinessLogoState] = useState<string>(
    localStorage.getItem('my_business_logo') || 'https://res.cloudinary.com/dvvugpu04/image/upload/v1784904453/My_Grafix_Media_logo_160px_edlkgm.png'
  );
  const [profileName, setProfileNameState] = useState<string>(
    localStorage.getItem('my_profile_name') || 'Nkosinathi Gumede'
  );
  const [profileEmail, setProfileEmailState] = useState<string>(
    localStorage.getItem('my_profile_email') || 'owner@mybusiness.com'
  );
  const [profileAvatar, setProfileAvatarState] = useState<string>(
    localStorage.getItem('my_profile_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
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

  const toggleDemoMode = () => {
    const nextMode = !demoMode;
    setDemoMode(nextMode);
    if (nextMode) {
      // Populate demo data
      setStats(sampleStats);
      setRevenueData(sampleRevenueData);
      setBookingsOverview(sampleBookingsOverview);
      setActivities(sampleActivities);
      setProducts(sampleProducts);
      setServices(sampleServices);
      setOrders(sampleOrders);
      setBookings(sampleBookings);
      setCustomers(sampleCustomers);
      setInventory(sampleInventory);
      setStaff(sampleStaff);
      setGallery(sampleGallery);
      setReviews(sampleReviews);
      setForms(sampleForms);
      setInvoices(sampleInvoices);
      setBusinessHealth(sampleBusinessHealth);
    } else {
      clearAllData();
    }
  };

  const clearAllData = () => {
    setStats(null);
    setRevenueData([]);
    setBookingsOverview(null);
    setActivities([]);
    setProducts([]);
    setServices([]);
    setOrders([]);
    setBookings([]);
    setCustomers([]);
    setInventory([]);
    setStaff([]);
    setGallery([]);
    setReviews([]);
    setForms([]);
    setInvoices([]);
    setBusinessHealth(null);
  };

  // Handlers for adding local state items
  const addOrder = (newOrder: Partial<Order>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/orders)
    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrder.orderNumber || `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newOrder.customerName || 'Walk-in Customer',
      customerEmail: newOrder.customerEmail || '',
      status: newOrder.status || 'completed',
      totalAmount: newOrder.totalAmount || 0,
      itemsCount: newOrder.itemsCount || 1,
      items: newOrder.items || [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod: newOrder.paymentMethod || 'card',
      isPos: newOrder.isPos ?? true,
    };
    setOrders((prev) => [order, ...prev]);
  };

  const addProduct = (newProd: Partial<Product>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/products)
    const product: Product = {
      id: `prod-${Date.now()}`,
      sku: newProd.sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      name: newProd.name || 'New Product',
      category: newProd.category || 'General',
      price: newProd.price || 0,
      stock: newProd.stock || 0,
      soldCount: 0,
      status: (newProd.stock || 0) > 10 ? 'in-stock' : (newProd.stock || 0) > 0 ? 'low-stock' : 'out-of-stock',
      imageUrl: newProd.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
    };
    setProducts((prev) => [product, ...prev]);
  };

  const addBooking = (newBk: Partial<Booking>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/bookings)
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode: `#BK-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newBk.clientName || 'Guest Client',
      clientPhone: newBk.clientPhone || '',
      serviceName: newBk.serviceName || 'Consultation',
      staffName: newBk.staffName || 'Staff Member',
      date: newBk.date || new Date().toISOString().substring(0, 10),
      time: newBk.time || '10:00',
      status: 'upcoming',
      amount: newBk.amount || 0,
    };
    setBookings((prev) => [booking, ...prev]);
  };

  const addService = (newServ: Partial<Service>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/services)
    const service: Service = {
      id: `serv-${Date.now()}`,
      name: newServ.name || 'New Service',
      category: newServ.category || 'General',
      durationMinutes: newServ.durationMinutes || 30,
      price: newServ.price || 0,
      description: newServ.description || '',
      isActive: true,
      imageUrl: newServ.imageUrl || undefined,
    };
    setServices((prev) => [service, ...prev]);
  };

  const addCustomer = (newCust: Partial<Customer>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/customers)
    const customer: Customer = {
      id: `cust-${Date.now()}`,
      name: newCust.name || 'New Client',
      email: newCust.email || '',
      phone: newCust.phone || '',
      tier: 'New',
      totalSpent: 0,
      ordersCount: 0,
      lastVisit: new Date().toISOString().substring(0, 10),
    };
    setCustomers((prev) => [customer, ...prev]);
  };

  const addInvoice = (newInv: Partial<Invoice>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/invoices)
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `#INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newInv.clientName || 'Client Name',
      clientEmail: newInv.clientEmail || '',
      amount: newInv.amount || 0,
      dueDate: newInv.dueDate || new Date().toISOString().substring(0, 10),
      issuedDate: new Date().toISOString().substring(0, 10),
      status: newInv.status || 'draft',
    };
    setInvoices((prev) => [invoice, ...prev]);
  };

  const addStaff = (newStaff: Partial<StaffMember>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/staff)
    const staffMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name || 'Team Member',
      role: newStaff.role || 'Staff',
      email: newStaff.email || '',
      phone: newStaff.phone || '',
      status: 'active',
      specialties: newStaff.specialties || ['General'],
    };
    setStaff((prev) => [staffMember, ...prev]);
  };

  const addGalleryItem = (item: Partial<GalleryItem>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/gallery/upload)
    const galleryItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: item.title || 'Uploaded Image',
      category: item.category || 'Portfolio',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
      uploadedAt: new Date().toISOString().substring(0, 10),
    };
    setGallery((prev) => [galleryItem, ...prev]);
  };

  const addReview = (rev: Partial<Review>) => {
    // TODO: connect to API (e.g. Cloudflare Worker POST /api/reviews)
    const review: Review = {
      id: `rev-${Date.now()}`,
      customerName: rev.customerName || 'Anonymous Customer',
      rating: rev.rating || 5,
      comment: rev.comment || '',
      serviceOrProduct: rev.serviceOrProduct || 'Service',
      date: new Date().toISOString().substring(0, 10),
      status: 'published',
    };
    setReviews((prev) => [review, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        demoMode,
        toggleDemoMode,
        isLoading,
        setIsLoading,
        stats,
        revenueData,
        bookingsOverview,
        activities,
        products,
        services,
        orders,
        bookings,
        customers,
        inventory,
        staff,
        gallery,
        reviews,
        forms,
        invoices,
        businessHealth,
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
        addOrder,
        addProduct,
        addBooking,
        addService,
        addCustomer,
        addInvoice,
        addStaff,
        addGalleryItem,
        addReview,
        clearAllData,
      }}
    >
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
