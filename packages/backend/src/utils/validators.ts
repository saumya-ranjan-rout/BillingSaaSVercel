import Joi from 'joi';
import { GST_STATES } from './constants';
import { UserRole, UserStatus } from '../entities/User';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(gstin)) return false;
  
  // Validate state code (first two digits)
  const stateCode = parseInt(gstin.substring(0, 2));
  return stateCode in GST_STATES;
};
export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};


export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};


export const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
 // phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  address: Joi.object({
    line1: Joi.string().required(),
    // line2: Joi.string().allow('').optional(),
    city: Joi.string().required(),
    state: Joi.string().valid(...Object.values(GST_STATES)).insensitive().required(),
    pincode: Joi.string().pattern(/^\d{6}$/).required(),
    country: Joi.string().default('India'),
  }).required(),
  //gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  phone: Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .allow('', null)
  .optional(),

gstin: Joi.string()
  .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
  .allow('', null)
  .optional(),
});
export const vendorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).allow('', null).optional(),
  type: Joi.string().valid('supplier', 'service_provider', 'contractor').default('supplier'),
  address: Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().allow('').optional(),
    city: Joi.string().required(),
    state: Joi.string().valid(...Object.values(GST_STATES)).insensitive().required(),
    postalCode: Joi.string().pattern(/^\d{6}$/).required(),
    country: Joi.string().default('India'),
  }).required(),
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).allow('', null).optional(),
  pan: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
  paymentTerms: Joi.string().allow('', null).optional(),
});

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.USER),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .default(UserStatus.ACTIVE),
  biometricEnabled: Joi.boolean().default(false),
  tenantId: Joi.string().uuid().optional(),
});
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.USER),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .default(UserStatus.ACTIVE),
  biometricEnabled: Joi.boolean().default(false),
  tenantId: Joi.string().uuid().optional(),
});

export const createTenantSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  plan: Joi.string().required(),
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  businessName: Joi.string().required(),
});

export const updateTenantSchema = Joi.object({
  name: Joi.string().optional(),
  plan: Joi.string().optional(),
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  businessName: Joi.string().optional(),
});

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().optional(),
  parentId: Joi.string().optional(),
  isActive: Joi.boolean().default(true)
});

export const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().optional(),
  type: Joi.string().valid('goods', 'service', 'digital').default('goods'),
  sku: Joi.string().optional(),
  hsnCode: Joi.string().optional(),
  costPrice: Joi.number().min(0).required(),
  sellingPrice: Joi.number().min(0).required(),
  stockQuantity: Joi.number().min(0).default(0),
  lowStockThreshold: Joi.number().min(0).default(0),
  unit: Joi.string().optional(),
  taxRate: Joi.number().min(0).max(100).default(0),
  categoryName: Joi.string().optional(),
    categoryId: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().default(true)
});

export const purchaseItemSchema = Joi.object({
  productId: Joi.string().optional(),
  description: Joi.string().required(),
  quantity: Joi.number().min(0.01).required(),
  unit: Joi.string().required(),
  unitPrice: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  taxRate: Joi.number().min(0).max(100).default(0),
});

export const purchaseOrderSchema = Joi.object({
  vendorId: Joi.string().required(),
  type: Joi.string().valid('product', 'service', 'expense').default('product'),
  orderDate: Joi.date().required(),
  expectedDeliveryDate: Joi.date().optional(),
  shippingAddress: Joi.string().allow('', null).optional(),
  billingAddress: Joi.string().allow('', null).optional(),
  termsAndConditions: Joi.string().allow('', null).optional(),
  notes: Joi.string().allow('', null).optional(),
  items: Joi.array().items(purchaseItemSchema).min(1).required(),
});

export const invoiceItemSchema = Joi.object({
  productId: Joi.string().optional(),
  description: Joi.string().required(),
  quantity: Joi.number().min(0.01).required(),
  unit: Joi.string().required(),
  unitPrice: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  taxRate: Joi.number().min(0).max(100).default(0),
});

export const invoiceSchema = Joi.object({
  //customerId: Joi.string().required(),
  customerName: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  type: Joi.string().valid('standard', 'proforma', 'credit', 'debit').default('standard'),
  issueDate: Joi.date().required(),
  dueDate: Joi.date().min(Joi.ref('issueDate')).required(),
  paymentTerms: Joi.string().valid('due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_60').default('net_15'),
  shippingAddress: Joi.string().allow('', null).optional(),
  billingAddress: Joi.string().allow('', null).optional(),
  termsAndConditions: Joi.string().allow('', null).optional(),
  notes: Joi.string().allow('', null).optional(),
  items: Joi.array().items(invoiceItemSchema).min(1).required(),
  isRecurring: Joi.boolean().default(false),
  recurringSettings: Joi.object({
    frequency: Joi.string().valid('weekly', 'monthly', 'quarterly', 'yearly').required(),
    interval: Joi.number().min(1).default(1),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    totalOccurrences: Joi.number().min(1).optional(),
  }).optional(),
});

export const paymentSchema = Joi.object({
  invoiceId: Joi.string().required(),
  amount: Joi.number().min(0.01).required(),
  method: Joi.string().valid('cash', 'bank_transfer', 'cheque', 'credit_card', 'debit_card', 'upi', 'wallet', 'other').required(),
  paymentDate: Joi.date().required(),
  referenceNumber: Joi.string().optional(),
  notes: Joi.string().optional(),
  paymentDetails: Joi.object().optional(),
});


export const createSubscriptionSchema = Joi.object({
  planId: Joi.string().uuid().required().messages({
    'any.required': 'Plan ID is required',
    'string.empty': 'Plan ID cannot be empty',
    'string.uuid': 'Invalid plan ID format'
  }),
  paymentGateway: Joi.string()
    .valid('razorpay', 'stripe', 'paypal')
    .default('razorpay')
})

export const reportGenerationSchema = Joi.object({
  type: Joi.string().valid(
    'gstr1_outward_supplies',
    'gstr2b_purchase_reconciliation',
    'gstr3b_summary',
    'e_invoice_register',
    'e_way_bill_register',
    'hsn_summary',
    'gstr9_annual_return',
    'gstr9c_reconciliation',
    'rcm_report',
    'sales_register',
    'purchase_register',
    'tds_report',
    'profit_loss',
    'balance_sheet',
    'form26as_reconciliation',
    'depreciation_register',
    'audit_trail',
    'cash_bank_book',
    'ledger_report',
    'expense_category',
    'reconciliation_summary'
  ).required(),
  format: Joi.string().valid('json', 'excel', 'pdf', 'csv').default('excel'),
  filters: Joi.object({
    fromDate: Joi.date().required(),
    toDate: Joi.date().min(Joi.ref('fromDate')).required(),
    customerIds: Joi.array().items(Joi.string()).optional(),
    vendorIds: Joi.array().items(Joi.string()).optional(),
    productIds: Joi.array().items(Joi.string()).optional(),
    status: Joi.array().items(Joi.string()).optional(),
  }).required(),
});

export const redeemCashbackSchema = Joi.object({
  customerId: Joi.number(),
  amount: Joi.number().positive(),
});

// export const updateProgramSchema = Joi.object({
//   programId: Joi.number(),
//   name: Joi.string().min(1),
//   pointsPerCurrency: Joi.number().positive(),
//   cashbackRate: Joi.number().min(0),
// });

export const updateProgramSchema = Joi.object({
  // tenantId comes from middleware; allow if present
  tenantId: Joi.string().optional(),

  // basic meta fields
  id: Joi.string().optional(),
  name: Joi.string().min(1).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  isDefault: Joi.boolean().optional(),

  // reward type (frontend uses 'cashback'|'points'|'discount')
  rewardType: Joi.string().valid('cashback', 'points', 'discount').required(),

  // cashback numeric fields: accept number OR numeric string OR null/empty
  cashbackPercentage: Joi.alternatives().try(
    Joi.number().min(0).max(100),
    Joi.string().pattern(/^\d+(\.\d+)?$/),
    Joi.valid(null),
    Joi.string().allow('')
  ).optional(),

  minimumPurchaseAmount: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().pattern(/^\d+(\.\d+)?$/),
    Joi.valid(null),
    Joi.string().allow('')
  ).optional(),

  maximumCashbackAmount: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().pattern(/^\d+(\.\d+)?$/),
    Joi.valid(null),
    Joi.string().allow('')
  ).optional(),

  // points related: accept number, numeric string, null or empty
  pointsPerUnit: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().pattern(/^\d+(\.\d+)?$/),
    Joi.valid(null),
    Joi.string().allow('')
  ).optional(),

  pointValue: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().pattern(/^\d+(\.\d+)?$/),
    Joi.valid(null),
    Joi.string().allow('')
  ).optional(),

  // eligibilityCriteria can be an object (your default) or string
  eligibilityCriteria: Joi.alternatives().try(
    Joi.object(),
    Joi.string().allow('', null)
  ).optional(),

  // redemptionRules: allow array of objects or plain object
  redemptionRules: Joi.alternatives().try(
    Joi.array().items(Joi.object()),
    Joi.object()
  ).optional(),

  // optional timestamps
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
})
  // allow extra keys from frontend/db so validation won't fail for unknown meta fields
  .unknown(true);




export const calculateCashbackSchema = Joi.object({
  customerId: Joi.number(),
  purchaseAmount: Joi.number().positive(),
});
