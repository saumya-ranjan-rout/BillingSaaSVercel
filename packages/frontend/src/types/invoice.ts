export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer?: Customer;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  currency: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  gstin?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}
