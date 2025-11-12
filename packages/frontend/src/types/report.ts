export enum ReportType {
  // GST Reports
  GSTR1_OUTWARD_SUPPLIES = 'gstr1_outward_supplies',
  GSTR2B_PURCHASE_RECONCILIATION = 'gstr2b_purchase_reconciliation',
  GSTR3B_SUMMARY = 'gstr3b_summary',
  E_INVOICE_REGISTER = 'e_invoice_register',
  E_WAY_BILL_REGISTER = 'e_way_bill_register',
  HSN_SUMMARY = 'hsn_summary',
  GSTR9_ANNUAL_RETURN = 'gstr9_annual_return',
  GSTR9C_RECONCILIATION = 'gstr9c_reconciliation',
  RCM_REPORT = 'rcm_report',
  
  // Income Tax Reports
  SALES_REGISTER = 'sales_register',
  PURCHASE_REGISTER = 'purchase_register',
  TDS_REPORT = 'tds_report',
  PROFIT_LOSS = 'profit_loss',
  BALANCE_SHEET = 'balance_sheet',
  FORM26AS_RECONCILIATION = 'form26as_reconciliation',
  DEPRECIATION_REGISTER = 'depreciation_register',
  
  // Other Reports
  AUDIT_TRAIL = 'audit_trail',
  CASH_BANK_BOOK = 'cash_bank_book',
  LEDGER_REPORT = 'ledger_report',
  EXPENSE_CATEGORY = 'expense_category',
  RECONCILIATION_SUMMARY = 'reconciliation_summary'
}

export enum ReportFormat {
  JSON = 'json',
  EXCEL = 'excel',
  PDF = 'pdf',
  CSV = 'csv'
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  parameters: Record<string, any>;
  filters: {
    fromDate: string;
    toDate: string;
    customerIds?: string[];
    vendorIds?: string[];
    productIds?: string[];
    status?: string[];
  };
  filePath?: string;
  recordCount?: number;
  generatedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  fromDate: string;
  toDate: string;
  customerIds?: string[];
  vendorIds?: string[];
  productIds?: string[];
  status?: string[];
}

export interface ReportGenerationRequest {
  type: ReportType;
  format: ReportFormat;
  filters: ReportFilters;
}

// Specific report data interfaces
export interface GSTR1ReportData {
  summary: {
    totalInvoices: number;
    totalTaxableValue: number;
    totalTaxAmount: number;
    totalCessAmount: number;
  };
  b2bInvoices: Array<{
    invoiceNumber: string;
    issueDate: string;
    customer: string;
    customerGSTIN: string;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    cess: number;
  }>;
  b2cInvoices: Array<{
    invoiceNumber: string;
    issueDate: string;
    customer: string;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    cess: number;
  }>;
  hsnSummary: Record<string, {
    hsnCode: string;
    description: string;
    quantity: number;
    taxableValue: number;
    taxAmount: number;
  }>;
}

export interface GSTR3BReportData {
  taxLiability: {
    outwardSupply: number;
    outwardTax: number;
    cgst: number;
    sgst: number;
    igst: number;
    cess: number;
  };
  itcDetails: {
    available: number;
    claimed: number;
    reversed: number;
    ineligible: number;
  };
  netPayable: number;
  dueDate: string;
}

export interface SalesRegisterReportData {
  date: string;
  invoiceNo: string;
  customer: string;
  customerGSTIN: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paymentStatus: string;
  paymentDate?: string;
}[]
