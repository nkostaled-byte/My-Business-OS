export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'in-progress';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'eft' | 'online';
export type CustomerTier = 'VIP' | 'Regular' | 'New';

export interface DashboardStats {
  totalRevenue: number;
  totalRevenueChangePercent: number;
  totalOrders: number;
  totalOrdersChangePercent: number;
  totalBookings: number;
  totalBookingsChangePercent: number;
  newCustomers: number;
  newCustomersChangePercent: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders?: number;
}

export interface BookingOverviewData {
  completed: number;
  upcoming: number;
  cancelled: number;
  total: number;
}

export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  status: OrderStatus;
  totalAmount: number;
  itemsCount: number;
  items?: OrderItem[];
  createdAt: string;
  paymentMethod?: PaymentMethod;
  isPos?: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  clientName: string;
  clientPhone?: string;
  serviceName: string;
  staffName?: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  costPrice?: number;
  stock: number;
  soldCount: number;
  imageUrl?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description?: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: CustomerTier;
  totalSpent: number;
  ordersCount: number;
  lastVisit?: string;
  avatarUrl?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  unitCost: number;
  lastRestocked?: string;
  status: 'normal' | 'low' | 'critical';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave' | 'inactive';
  avatarUrl?: string;
  specialties: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  uploadedAt: string;
  fileSizeMb?: number;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  serviceOrProduct?: string;
  date: string;
  status: 'published' | 'pending' | 'flagged';
}

export interface FormSubmission {
  id: string;
  formName: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  senderCompany?: string;
  subject?: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  source?: string;
  message?: string;
  dataSummary: Record<string, string>;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName?: string;
  clientEmail?: string;
  amount?: number;
  total?: number;
  subtotal?: number;
  tax?: number;
  dueDate?: string;
  dueAt?: string;
  issuedDate?: string;
  issuedAt?: string;
  status: InvoiceStatus;
  items?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  price: number;
  lineTotal?: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'order' | 'booking' | 'payment' | 'customer' | 'product' | 'system';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BusinessHealth {
  profileCompleteness: number; // 0-100
  setupChecklist: number;      // 0-100
  customerSatisfaction: number; // 0-100
  responseRate: number;        // 0-100
}
