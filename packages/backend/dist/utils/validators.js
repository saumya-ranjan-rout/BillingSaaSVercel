"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCashbackSchema = exports.updateProgramSchema = exports.redeemCashbackSchema = exports.reportGenerationSchema = exports.createSubscriptionSchema = exports.paymentSchema = exports.invoiceSchema = exports.invoiceItemSchema = exports.purchaseOrderSchema = exports.purchaseItemSchema = exports.productSchema = exports.categorySchema = exports.updateTenantSchema = exports.createTenantSchema = exports.updateUserSchema = exports.createUserSchema = exports.vendorSchema = exports.customerSchema = exports.validatePhone = exports.validatePAN = exports.validateGSTIN = exports.validateEmail = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("./constants");
const User_1 = require("../entities/User");
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validateGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstin))
        return false;
    const stateCode = parseInt(gstin.substring(0, 2));
    return stateCode in constants_1.GST_STATES;
};
exports.validateGSTIN = validateGSTIN;
const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
};
exports.validatePAN = validatePAN;
const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};
exports.validatePhone = validatePhone;
exports.customerSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    address: joi_1.default.object({
        line1: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().valid(...Object.values(constants_1.GST_STATES)).insensitive().required(),
        pincode: joi_1.default.string().pattern(/^\d{6}$/).required(),
        country: joi_1.default.string().default('India'),
    }).required(),
    phone: joi_1.default.string()
        .pattern(/^[6-9]\d{9}$/)
        .allow('', null)
        .optional(),
    gstin: joi_1.default.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .allow('', null)
        .optional(),
});
exports.vendorSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().optional(),
    phone: joi_1.default.string().pattern(/^[6-9]\d{9}$/).allow('', null).optional(),
    type: joi_1.default.string().valid('supplier', 'service_provider', 'contractor').default('supplier'),
    address: joi_1.default.object({
        line1: joi_1.default.string().required(),
        line2: joi_1.default.string().allow('').optional(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().valid(...Object.values(constants_1.GST_STATES)).insensitive().required(),
        postalCode: joi_1.default.string().pattern(/^\d{6}$/).required(),
        country: joi_1.default.string().default('India'),
    }).required(),
    gstin: joi_1.default.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).allow('', null).optional(),
    pan: joi_1.default.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(),
    paymentTerms: joi_1.default.string().allow('', null).optional(),
});
exports.createUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(100).required(),
    lastName: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string()
        .valid(...Object.values(User_1.UserRole))
        .default(User_1.UserRole.USER),
    status: joi_1.default.string()
        .valid(...Object.values(User_1.UserStatus))
        .default(User_1.UserStatus.ACTIVE),
    biometricEnabled: joi_1.default.boolean().default(false),
    tenantId: joi_1.default.string().uuid().optional(),
});
exports.updateUserSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(100).required(),
    lastName: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string()
        .valid(...Object.values(User_1.UserRole))
        .default(User_1.UserRole.USER),
    status: joi_1.default.string()
        .valid(...Object.values(User_1.UserStatus))
        .default(User_1.UserStatus.ACTIVE),
    biometricEnabled: joi_1.default.boolean().default(false),
    tenantId: joi_1.default.string().uuid().optional(),
});
exports.createTenantSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    plan: joi_1.default.string().required(),
    gstin: joi_1.default.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
    businessName: joi_1.default.string().required(),
});
exports.updateTenantSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    plan: joi_1.default.string().optional(),
    gstin: joi_1.default.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
    businessName: joi_1.default.string().optional(),
});
exports.categorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    description: joi_1.default.string().optional(),
    parentId: joi_1.default.string().optional(),
    isActive: joi_1.default.boolean().default(true)
});
exports.productSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(200).required(),
    description: joi_1.default.string().optional(),
    type: joi_1.default.string().valid('goods', 'service', 'digital').default('goods'),
    sku: joi_1.default.string().optional(),
    hsnCode: joi_1.default.string().optional(),
    costPrice: joi_1.default.number().min(0).required(),
    sellingPrice: joi_1.default.number().min(0).required(),
    stockQuantity: joi_1.default.number().min(0).default(0),
    lowStockThreshold: joi_1.default.number().min(0).default(0),
    unit: joi_1.default.string().allow("").optional(),
    taxRate: joi_1.default.number().min(0).max(100).default(0),
    categoryName: joi_1.default.string().optional(),
    categoryId: joi_1.default.string().optional(),
    images: joi_1.default.array().items(joi_1.default.string()).optional(),
    isActive: joi_1.default.boolean().default(true)
});
exports.purchaseItemSchema = joi_1.default.object({
    productId: joi_1.default.string().optional(),
    description: joi_1.default.string().required(),
    quantity: joi_1.default.number().min(0.01).required(),
    unit: joi_1.default.string().required(),
    unitPrice: joi_1.default.number().min(0).required(),
    discount: joi_1.default.number().min(0).max(100).default(0),
    taxRate: joi_1.default.number().min(0).max(100).default(0),
});
exports.purchaseOrderSchema = joi_1.default.object({
    vendorId: joi_1.default.string().required(),
    type: joi_1.default.string().valid('product', 'service', 'expense').default('product'),
    orderDate: joi_1.default.date().required(),
    expectedDeliveryDate: joi_1.default.date().optional(),
    shippingAddress: joi_1.default.string().allow('', null).optional(),
    billingAddress: joi_1.default.string().allow('', null).optional(),
    termsAndConditions: joi_1.default.string().allow('', null).optional(),
    notes: joi_1.default.string().allow('', null).optional(),
    items: joi_1.default.array().items(exports.purchaseItemSchema).min(1).required(),
});
exports.invoiceItemSchema = joi_1.default.object({
    productId: joi_1.default.string().optional(),
    description: joi_1.default.string().required(),
    quantity: joi_1.default.number().min(0.01).required(),
    unit: joi_1.default.string().required(),
    unitPrice: joi_1.default.number().min(0).required(),
    discount: joi_1.default.number().min(0).max(100).default(0),
    taxRate: joi_1.default.number().min(0).max(100).default(0),
});
exports.invoiceSchema = joi_1.default.object({
    customerName: joi_1.default.string().required(),
    customerEmail: joi_1.default.string().email().required(),
    type: joi_1.default.string().valid('standard', 'proforma', 'credit', 'debit').default('standard'),
    issueDate: joi_1.default.date().required(),
    dueDate: joi_1.default.date().min(joi_1.default.ref('issueDate')).required(),
    paymentTerms: joi_1.default.string().valid('due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_60').default('net_15'),
    shippingAddress: joi_1.default.string().allow('', null).optional(),
    billingAddress: joi_1.default.string().allow('', null).optional(),
    termsAndConditions: joi_1.default.string().allow('', null).optional(),
    notes: joi_1.default.string().allow('', null).optional(),
    items: joi_1.default.array().items(exports.invoiceItemSchema).min(1).required(),
    isRecurring: joi_1.default.boolean().default(false),
    cashBack: joi_1.default.number().min(0).default(0),
    recurringSettings: joi_1.default.object({
        frequency: joi_1.default.string().valid('weekly', 'monthly', 'quarterly', 'yearly').required(),
        interval: joi_1.default.number().min(1).default(1),
        startDate: joi_1.default.date().required(),
        endDate: joi_1.default.date().optional(),
        totalOccurrences: joi_1.default.number().min(1).optional(),
    }).optional(),
});
exports.paymentSchema = joi_1.default.object({
    invoiceId: joi_1.default.string().required(),
    amount: joi_1.default.number().min(0.01).required(),
    method: joi_1.default.string().valid('cash', 'bank_transfer', 'cheque', 'credit_card', 'debit_card', 'upi', 'wallet', 'other').required(),
    paymentDate: joi_1.default.date().required(),
    referenceNumber: joi_1.default.string().optional(),
    notes: joi_1.default.string().optional(),
    paymentDetails: joi_1.default.object().optional(),
});
exports.createSubscriptionSchema = joi_1.default.object({
    planId: joi_1.default.string().uuid().required().messages({
        'any.required': 'Plan ID is required',
        'string.empty': 'Plan ID cannot be empty',
        'string.uuid': 'Invalid plan ID format'
    }),
    paymentGateway: joi_1.default.string()
        .valid('razorpay', 'stripe', 'paypal')
        .default('razorpay')
});
exports.reportGenerationSchema = joi_1.default.object({
    type: joi_1.default.string().valid('gstr1_outward_supplies', 'gstr2b_purchase_reconciliation', 'gstr3b_summary', 'e_invoice_register', 'e_way_bill_register', 'hsn_summary', 'gstr9_annual_return', 'gstr9c_reconciliation', 'rcm_report', 'sales_register', 'purchase_register', 'tds_report', 'profit_loss', 'balance_sheet', 'form26as_reconciliation', 'depreciation_register', 'audit_trail', 'cash_bank_book', 'ledger_report', 'expense_category', 'reconciliation_summary').required(),
    format: joi_1.default.string().valid('json', 'excel', 'pdf', 'csv').default('excel'),
    filters: joi_1.default.object({
        fromDate: joi_1.default.date().required(),
        toDate: joi_1.default.date().min(joi_1.default.ref('fromDate')).required(),
        customerIds: joi_1.default.array().items(joi_1.default.string()).optional(),
        vendorIds: joi_1.default.array().items(joi_1.default.string()).optional(),
        productIds: joi_1.default.array().items(joi_1.default.string()).optional(),
        status: joi_1.default.array().items(joi_1.default.string()).optional(),
    }).required(),
});
exports.redeemCashbackSchema = joi_1.default.object({
    customerId: joi_1.default.string(),
    amount: joi_1.default.number().positive(),
});
exports.updateProgramSchema = joi_1.default.object({
    tenantId: joi_1.default.string().optional(),
    id: joi_1.default.string().optional(),
    name: joi_1.default.string().min(1).optional(),
    description: joi_1.default.string().allow('', null).optional(),
    status: joi_1.default.string().valid('active', 'inactive').optional(),
    isDefault: joi_1.default.boolean().optional(),
    rewardType: joi_1.default.string().valid('cashback', 'points', 'discount').required(),
    cashbackPercentage: joi_1.default.alternatives().try(joi_1.default.number().min(0).max(100), joi_1.default.string().pattern(/^\d+(\.\d+)?$/), joi_1.default.valid(null), joi_1.default.string().allow('')).optional(),
    minimumPurchaseAmount: joi_1.default.alternatives().try(joi_1.default.number().min(0), joi_1.default.string().pattern(/^\d+(\.\d+)?$/), joi_1.default.valid(null), joi_1.default.string().allow('')).optional(),
    maximumCashbackAmount: joi_1.default.alternatives().try(joi_1.default.number().min(0), joi_1.default.string().pattern(/^\d+(\.\d+)?$/), joi_1.default.valid(null), joi_1.default.string().allow('')).optional(),
    pointsPerUnit: joi_1.default.alternatives().try(joi_1.default.number().min(0), joi_1.default.string().pattern(/^\d+(\.\d+)?$/), joi_1.default.valid(null), joi_1.default.string().allow('')).optional(),
    pointValue: joi_1.default.alternatives().try(joi_1.default.number().min(0), joi_1.default.string().pattern(/^\d+(\.\d+)?$/), joi_1.default.valid(null), joi_1.default.string().allow('')).optional(),
    eligibilityCriteria: joi_1.default.alternatives().try(joi_1.default.object(), joi_1.default.string().allow('', null)).optional(),
    redemptionRules: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.object()), joi_1.default.object()).optional(),
    createdAt: joi_1.default.date().optional(),
    updatedAt: joi_1.default.date().optional()
})
    .unknown(true);
exports.calculateCashbackSchema = joi_1.default.object({
    customerId: joi_1.default.number(),
    purchaseAmount: joi_1.default.number().positive(),
});
//# sourceMappingURL=validators.js.map