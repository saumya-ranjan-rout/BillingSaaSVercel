export const INVOICE_STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  sent: { label: 'Sent', color: 'blue' },
  paid: { label: 'Paid', color: 'green' },
  overdue: { label: 'Overdue', color: 'red' },
  cancelled: { label: 'Cancelled', color: 'gray' },
} as const;

export const USER_ROLES = {
  admin: 'Administrator',
  accountant: 'Accountant',
  user: 'User',
} as const;

export const TAX_RATES = [0, 5, 12, 18, 28];

export const CURRENCIES = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
} as const;

export const DEFAULT_CURRENCY = 'INR';

export const DATE_FORMATS = {
  short: 'DD/MM/YYYY',
  medium: 'DD MMM YYYY',
  long: 'DD MMMM YYYY',
  full: 'dddd, DD MMMM YYYY',
} as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_PAGE_SIZE = 25;

export const GST_SLABS = [
  { value: 0, label: '0% - Exempt' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' },
];
