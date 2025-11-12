export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  plan: string;
  gstin: string;
  businessName: string;
  address: Address;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: Address;
  gstin?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  taxRate: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  customerId: string;
  customer?: Customer;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentTerms: number;
  notes?: string;
  tenantId: string;
  gstBreakdown?: GSTBreakdown;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
  taxAmount: number;
}

export interface Subscription {
  id: string;
  tenantId: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface GSTBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  taxableValue: number;
}

export interface GSTR1Data {
  gstin: string;
  period: string;
  invoices: GSTR1Invoice[];
  summary: GSTR1Summary;
}

export interface GSTR1Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerGSTIN?: string;
  taxableValue: number;
  totalTax: number;
  placeOfSupply: string;
  reverseCharge: boolean;
  ecommerceGstin?: string;
  rate: number;
  taxAmount: number;
}

export interface GSTR1Summary {
  totalTaxableValue: number;
  totalTax: number;
  totalInvoices: number;
}

export type TaxType = 'cgst_sgst' | 'igst' | 'none';

export interface JWTPayload {
    id: string;   // 👈 instead of userId
  tenantId: string;
  email: string;
  role: string;
  // permissions: string[];
    firstName: string;
  lastName: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
