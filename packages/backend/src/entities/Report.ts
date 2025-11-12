import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TenantAwareEntity } from './BaseEntity';
import { Tenant } from './Tenant';

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

@Entity('reports')
export class Report extends TenantAwareEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'enum', enum: ReportFormat })
  format: ReportFormat;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ type: 'jsonb', nullable: true })
  parameters: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  filters: {
    fromDate: Date;
    toDate: Date;
    customerIds?: string[];
    vendorIds?: string[];
    productIds?: string[];
    status?: string[];
  };

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'integer', nullable: true })
  recordCount: number;

  @Column({ type: 'timestamp', nullable: true })
  generatedAt: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @ManyToOne(() => Tenant, tenant => tenant.reports)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;
}
