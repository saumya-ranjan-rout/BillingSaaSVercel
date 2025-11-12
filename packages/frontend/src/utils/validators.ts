export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  return panRegex.test(pan);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateNumber = (value: any): boolean => {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    return !isNaN(parseFloat(value)) && isFinite(value as any);
  }
  return false;
};

export const validatePositiveNumber = (value: any): boolean => {
  if (!validateNumber(value)) return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num > 0;
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const validateFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
};
