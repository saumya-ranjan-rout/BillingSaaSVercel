import { Invoice, InvoiceItem, GSTBreakdown } from '../types/customTypes';

export const generateInvoiceNumber = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

export const calculateInvoiceTotals = (items: InvoiceItem[]): { subtotal: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date, includeTime: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

export const isWithinBusinessHours = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 17; // 9 AM to 5 PM
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
