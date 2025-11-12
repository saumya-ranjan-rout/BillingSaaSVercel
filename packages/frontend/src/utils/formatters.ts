export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date, format: string = 'medium') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'short':
      options.day = '2-digit';
      options.month = '2-digit';
      options.year = 'numeric';
      break;
    case 'medium':
      options.day = '2-digit';
      options.month = 'short';
      options.year = 'numeric';
      break;
    case 'long':
      options.day = '2-digit';
      options.month = 'long';
      options.year = 'numeric';
      break;
    case 'full':
      options.weekday = 'long';
      options.day = '2-digit';
      options.month = 'long';
      options.year = 'numeric';
      break;
    default:
      options.day = '2-digit';
      options.month = 'short';
      options.year = 'numeric';
  }
  
  return new Intl.DateTimeFormat('en-IN', options).format(dateObj);
};

export const formatPhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the number is an Indian number
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  if (cleaned.length > 10) {
    // International number
    return cleaned.replace(/(\d{1,3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
  }
  
  return phone;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateInvoiceNumber = (lastInvoiceNumber?: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  if (!lastInvoiceNumber) {
    return `INV-${year}${month}-001`;
  }
  
  const parts = lastInvoiceNumber.split('-');
  if (parts.length !== 3) {
    return `INV-${year}${month}-001`;
  }
  
  const lastYearMonth = parts[1];
  const lastSequence = parseInt(parts[2]);
  
  if (lastYearMonth === `${year}${month}`) {
    return `INV-${year}${month}-${(lastSequence + 1).toString().padStart(3, '0')}`;
  }
  
  return `INV-${year}${month}-001`;
};

export const calculateInvoiceTotals = (items: any[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxTotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    return sum + (itemTotal * (item.taxRate / 100));
  }, 0);
  
  return {
    subtotal,
    taxTotal,
    total: subtotal + taxTotal
  };
};
