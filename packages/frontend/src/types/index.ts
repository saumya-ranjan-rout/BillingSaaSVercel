
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user' | 'superadmin';
  createdAt: string;
  updatedAt: string;
    tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'basic' | 'premium' | 'enterprise';
  isActive: boolean;
  users: User[];
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  currency: string;
  taxEnabled: boolean;
  taxRate: number;
  invoicePrefix: string;
  dueDateDays: number;
}



export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
    requestedBy: {
      id: string;
      tenantId: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;

  };
  requestedTo: {
    id: string;
   tenantId: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  gstin?: string;
  pan?: string;
  isActive: boolean;
  creditBalance: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
   checkSubscription?: "active" | "inactive";

}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'supplier' | 'service_provider' | 'contractor';
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  gstin?: string;
  pan?: string;
  isActive: boolean;
  outstandingBalance: number;
  paymentTerms?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  type: 'goods' | 'service' | 'digital';
  sku?: string;
  hsnCode?: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  unit?: string;
  taxRate: number;
  categoryId?: string;
  category?: Category;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}




export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  product?: Product;
}

export interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'cheque' | 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  paymentDetails?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'standard' | 'proforma' | 'credit' | 'debit';
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  customerId: string;
  customer?: Customer;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentTerms: 'due_on_receipt' | 'net_7' | 'net_15' | 'net_30' | 'net_60';
  shippingAddress?: string;
  billingAddress?: string;
  termsAndConditions?: string;
  notes?: string;
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  taxDetails: Array<{
    taxName: string;
    taxRate: number;
    taxAmount: number;
  }>;
  discountDetails: Array<{
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  }>;
  isRecurring: boolean;
  recurringSettings?: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number;
    startDate: string;
    endDate?: string;
    totalOccurrences?: number;
  };
  sentAt?: string;
  viewedAt?: string;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type Setting = {
  id?: string;
  tenantId?: string;
  companyName?: string;
  subdomain?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  gstNumber?: string;
};



export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  currentTenant: Tenant | null;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}



export interface DashboardStats {
  totalRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalCustomers: number;
  overdueInvoices: number;
  monthlyRevenue: number[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}


export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}


export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'paused';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  usage: {
    users: number;
    invoices: number;
    storage: number;
  };
  limits: {
    users: number | 'Unlimited';
    invoices: number | 'Unlimited';
    storage: number | 'Unlimited';
  };
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  name: string;
  isDefault: boolean;
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  type: 'invoice' | 'receipt';
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface PurchaseItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  receivedQuantity: number;
  isReceived: boolean;
  product?: Product;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled' | 'paid';
  type: 'product' | 'service' | 'expense';
  vendorId: string;
  vendor?: Vendor;
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  shippingAddress?: string;
  billingAddress?: string;
  termsAndConditions?: string;
  notes?: string;
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  taxDetails: Array<{
    taxName: string;
    taxRate: number;
    taxAmount: number;
  }>;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}


// -----------------------------------------
// 🧾 Subscription Plan Types
// -----------------------------------------

export enum PlanType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  planType: PlanType;
  features: {
    maxUsers: number;
    maxStorage: number;
    gstFiling?: boolean;
    taxFiling?: boolean;
    advancedReporting?: boolean;
  };
}
export interface CreatePurchaseOrderRequest {
  vendorId: string;
  type: 'product' | 'service' | 'expense';
  orderDate: string;
  expectedDeliveryDate?: string;
  billingAddress?: string;
  shippingAddress?: string;
  termsAndConditions?: string;
  notes?: string;
  items: Array<{
    productId?: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    taxRate: number;
    discount?: number;
  }>;
}

export interface UpdatePurchaseOrderRequest extends Partial<CreatePurchaseOrderRequest> {
  status?: PurchaseOrderStatus;
  amountPaid?: number;
  balanceDue?: number;
}