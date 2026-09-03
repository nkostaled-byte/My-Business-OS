export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type BookingStatus = 'upcoming' | 'confirmed' | 'completed' | 'cancelled' | 'in-progress';
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
  displayOnWebsite?: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description?: string;
  active?: boolean;
  imageUrl?: string;
  displayOnWebsite?: boolean;
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
  active?: boolean;
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
  productId?: string;
  serviceId?: string;
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

// ─── Lead Generation & CRM ─────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';
export type OpportunityLevel = 'hot' | 'warm' | 'cold';

export interface LeadCompany {
  id: string;
  name: string;
  domain?: string | null;
  website?: string | null;
  industry?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  sizeBucket?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  socialLinks?: Record<string, string> | null;
  tags?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  companyId?: string | null;
  company?: { id: string; name?: string; domain?: string } | null;
  contactName?: string;
  companyName?: string;
  avatarUrl?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export interface LeadStage {
  id: string;
  name: string;
  color: string;
  position?: number;
  count?: number;
  leads?: Lead[];
}

export interface LeadTag {
  id: string;
  name: string;
  color?: string;
}

export interface LeadActivity {
  id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface LeadNote {
  id: string;
  author?: string;
  body: string;
  createdAt?: string;
}

export interface LeadTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  status: 'pending' | 'completed';
  assignedTo?: string | null;
  completedAt?: string | null;
  createdAt?: string;
}

export interface LeadFollowUp {
  id: string;
  dueAt: string;
  note?: string;
  status: 'pending' | 'completed';
  createdAt?: string;
}

export interface ScoreDeduction {
  category: string;
  label: string;
  points: number;
  impact: string;
}

export interface RecommendedService {
  id: string;
  name: string;
  priceRange: string;
  description: string;
}

export interface ScoreResult {
  score: number;
  opportunityLevel: OpportunityLevel;
  priority: LeadPriority;
  recommendedServices: RecommendedService[] | string[];
  reasoning: string;
  deductions: ScoreDeduction[];
}

export interface AiBrief {
  whatIsWrong: string;
  improvements: string[];
  recommended: string;
  salesMessage: string;
}

export interface AuditResult {
  url?: string;
  domain?: string;
  businessName?: string;
  title?: string;
  description?: string;
  emails?: string[];
  phones?: string[];
  address?: string;
  social?: Record<string, string>;
  cms?: string | null;
  frameworks?: string[];
  analytics?: string[];
  emailMarketing?: string[];
  wordCount?: number;
  hasSearch?: boolean;
  hasLogin?: boolean;
  hasBlog?: boolean;
  hasContactForm?: boolean;
  hasTestimonials?: boolean;
  hasReviews?: boolean;
  hasSsl?: boolean;
  hasHttpsRedirect?: boolean;
  missingMetaDescription?: boolean;
  missingOgTags?: boolean;
  noContentProposal?: boolean;
  noEmailCapture?: boolean;
  noLiveChat?: boolean;
  menuOnlyPdf?: boolean;
  [key: string]: unknown;
}

export interface Lead {
  id: string;
  website: string;
  websiteUrl?: string;
  companyId?: string | null;
  contactId?: string | null;
  company?: LeadCompany | null;
  contact?: LeadContact | null;
  leadName: string;
  contactName?: string;
  companyName?: string;
  domain?: string;
  status: LeadStatus;
  stage: string;
  priority: LeadPriority;
  score: number;
  scoreBreakdown?: { deductions?: ScoreDeduction[] } | null;
  opportunityLevel?: OpportunityLevel | null;
  recommendedServices?: RecommendedService[] | string[] | null;
  aiSummary?: string | AiBrief | Record<string, unknown> | null;
  emails?: string[] | null;
  phones?: string[] | null;
  socialLinks?: Record<string, string> | null;
  address?: string | null;
  estimatedValue?: number | null;
  assignedTo?: string | null;
  assignedName?: string | null;
  tags?: string[] | null;
  customFields?: Record<string, unknown> | null;
  notes?: string | null;
  lossReason?: string | null;
  nextFollowupAt?: string | null;
  wonAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Inline detail sub-resources (from GET /api/leads/:id)
  notesList?: LeadNote[];
  tasks?: LeadTask[];
  activities?: LeadActivity[];
  followups?: LeadFollowUp[];
}

export interface LeadPipeline {
  stages: LeadStage[];
  total: number;
}

export interface AuditFullResponse {
  audit: AuditResult;
  score: ScoreResult;
  ai: AiBrief;
}

export interface PlaceBusiness {
  placeId: string;
  name: string;
  address: string;
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
  ratingCount?: number | null;
  category?: string | null;
  types?: string[];
  latitude?: number | null;
  longitude?: number | null;
}
