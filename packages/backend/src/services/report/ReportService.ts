import { Repository, Between, In, IsNull } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Report, ReportType, ReportStatus, ReportFormat } from '../../entities/Report';
import { Invoice, InvoiceStatus } from '../../entities/Invoice';
import { Customer } from '../../entities/Customer';
import { Vendor } from '../../entities/Vendor';
import { PaymentInvoice, PaymentMethod, PaymentStatus, PaymentType } from '../../entities/PaymentInvoice';
import { AuditLog } from '../../entities/AuditLog';
import { Product } from '../../entities/Product';
import { User } from '../../entities/User';
import { Expense } from '../../entities/Expense';
import { TaxDetail } from '../../entities/TaxDetail';
import logger from '../../utils/logger';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { PaginatedResponse } from '../../types/customTypes';
import PDFDocument from 'pdfkit';
import { CacheService } from '../cache/CacheService';

export class ReportService {
  private reportRepository: Repository<Report>;
  private invoiceRepository: Repository<Invoice>;
  private customerRepository: Repository<Customer>;
  private vendorRepository: Repository<Vendor>;
  private paymentRepository: Repository<PaymentInvoice>;
  private auditLogRepository: Repository<AuditLog>;
  private productRepository: Repository<Product>;
  private userRepository: Repository<User>;
  private expenseRepository: Repository<Expense>;
  private taxDetailRepository: Repository<TaxDetail>;
    private cacheService: CacheService;

  constructor() {
    this.reportRepository = AppDataSource.getRepository(Report);
    this.invoiceRepository = AppDataSource.getRepository(Invoice);
    this.customerRepository = AppDataSource.getRepository(Customer);
    this.vendorRepository = AppDataSource.getRepository(Vendor);
    this.paymentRepository = AppDataSource.getRepository(PaymentInvoice);
    this.auditLogRepository = AppDataSource.getRepository(AuditLog);
    this.productRepository = AppDataSource.getRepository(Product);
    this.userRepository = AppDataSource.getRepository(User);
    this.expenseRepository = AppDataSource.getRepository(Expense);
    this.taxDetailRepository = AppDataSource.getRepository(TaxDetail);
        this.cacheService = new CacheService();
  }

  async generateReport(tenantId: string, reportType: ReportType, format: ReportFormat, filters: any): Promise<Report> {
    const report = this.reportRepository.create({
      name: this.getReportName(reportType),
      type: reportType,
      format,
      parameters: filters,
      filters,
      tenantId,
      status: ReportStatus.GENERATING
    });
//console.log(report);
    const savedReport = await this.reportRepository.save(report);

    try {
      let result: any;

      switch (reportType) {
        case ReportType.GSTR1_OUTWARD_SUPPLIES:
          result = await this.generateGSTR1(tenantId, filters);
          break;
        case ReportType.GSTR2B_PURCHASE_RECONCILIATION:
          result = await this.generateGSTR2B(tenantId, filters);
          break;
        case ReportType.GSTR3B_SUMMARY:
          result = await this.generateGSTR3B(tenantId, filters);
          break;
        case ReportType.E_INVOICE_REGISTER:
          result = await this.generateEInvoiceRegister(tenantId, filters);
          break;
        case ReportType.E_WAY_BILL_REGISTER:
          result = await this.generateEWayBillRegister(tenantId, filters);
          break;
        case ReportType.HSN_SUMMARY:
          result = await this.generateHSNSummary(tenantId, filters);
          break;
        case ReportType.GSTR9_ANNUAL_RETURN:
          result = await this.generateGSTR9(tenantId, filters);
          break;
        case ReportType.GSTR9C_RECONCILIATION:
          result = await this.generateGSTR9C(tenantId, filters);
          break;
        case ReportType.RCM_REPORT:
          result = await this.generateRCMReport(tenantId, filters);
          break;
        case ReportType.SALES_REGISTER:
          result = await this.generateSalesRegister(tenantId, filters);
          break;
        case ReportType.PURCHASE_REGISTER:
          result = await this.generatePurchaseRegister(tenantId, filters);
          break;
        case ReportType.TDS_REPORT:
          result = await this.generateTDSReport(tenantId, filters);
          break;
        case ReportType.PROFIT_LOSS:
          result = await this.generateProfitLoss(tenantId, filters);
          break;
        case ReportType.BALANCE_SHEET:
          result = await this.generateBalanceSheet(tenantId, filters);
          break;
        case ReportType.FORM26AS_RECONCILIATION:
          result = await this.generateForm26AS(tenantId, filters);
          break;
        case ReportType.DEPRECIATION_REGISTER:
          result = await this.generateDepreciationRegister(tenantId, filters);
          break;
        case ReportType.AUDIT_TRAIL:
          result = await this.generateAuditTrail(tenantId, filters);
          break;
        case ReportType.CASH_BANK_BOOK:
          result = await this.generateCashBankBook(tenantId, filters);
          break;
        case ReportType.LEDGER_REPORT:
          result = await this.generateLedgerReport(tenantId, filters);
          break;
        case ReportType.EXPENSE_CATEGORY:
          result = await this.generateExpenseCategory(tenantId, filters);
          break;
        case ReportType.RECONCILIATION_SUMMARY:
          result = await this.generateReconciliationSummary(tenantId, filters);
          break;
        default:
          throw new Error(`Unsupported report type: ${reportType}`);
      }

      const filePath = await this.exportReport(result, reportType, format, filters);
      
      savedReport.filePath = filePath;
      savedReport.recordCount = this.calculateRecordCount(result);
      savedReport.generatedAt = new Date();
      savedReport.status = ReportStatus.COMPLETED;

       await Promise.all([
        this.cacheService.invalidatePattern(`reports:${tenantId}:*`),
        this.cacheService.invalidatePattern(`cache:${tenantId}:/api/reports*`),
      ]);

    } catch (error: unknown) {
      savedReport.status = ReportStatus.FAILED;
      if (error instanceof Error) {
        savedReport.errorMessage = error.message;
        logger.error('Error generating report:', error);
      } else {
        savedReport.errorMessage = String(error);
        logger.error('Error generating report:', error);
      }
    }

    return await this.reportRepository.save(savedReport);
  }

  private calculateRecordCount(data: any): number {
    if (!data) return 0;
    
    if (Array.isArray(data)) return data.length;
    
    if (typeof data === 'object') {
      // Count records in arrays within the object
      let count = 0;
      Object.values(data).forEach(value => {
        if (Array.isArray(value)) {
          count += value.length;
        }
      });
      return count > 0 ? count : 1; // Return at least 1 for summary reports
    }
    
    return 1;
  }

  async getReportData(report: Report): Promise<any> {
    if (!report.filePath || !fs.existsSync(report.filePath)) {
      throw new Error('Report file not found');
    }

    // For JSON format, read and return the data
    if (report.format === ReportFormat.JSON) {
      const data = fs.readFileSync(report.filePath, 'utf8');
      return JSON.parse(data);
    }

    // For other formats, regenerate the data structure for preview
    return await this.regenerateReportData(report.type, report.filters, report.tenantId);
  }

  private async regenerateReportData(reportType: ReportType, filters: any, tenantId: string): Promise<any> {
    switch (reportType) {
      case ReportType.GSTR1_OUTWARD_SUPPLIES:
        return await this.generateGSTR1(tenantId, filters);
      case ReportType.GSTR3B_SUMMARY:
        return await this.generateGSTR3B(tenantId, filters);
      case ReportType.SALES_REGISTER:
        return await this.generateSalesRegister(tenantId, filters);
      case ReportType.PURCHASE_REGISTER:
        return await this.generatePurchaseRegister(tenantId, filters);
      case ReportType.TDS_REPORT:
        return await this.generateTDSReport(tenantId, filters);
      case ReportType.PROFIT_LOSS:
        return await this.generateProfitLoss(tenantId, filters);
      case ReportType.AUDIT_TRAIL:
        return await this.generateAuditTrail(tenantId, filters);
      case ReportType.CASH_BANK_BOOK:
        return await this.generateCashBankBook(tenantId, filters);
      case ReportType.HSN_SUMMARY:
        return await this.generateHSNSummary(tenantId, filters);
      case ReportType.E_INVOICE_REGISTER:
        return await this.generateEInvoiceRegister(tenantId, filters);
      default:
        return await this.generateGenericReport(tenantId, filters);
    }
  }

  private getReportName(reportType: ReportType): string {
    const names = {
      [ReportType.GSTR1_OUTWARD_SUPPLIES]: 'GSTR-1 Outward Supplies Report',
      [ReportType.GSTR2B_PURCHASE_RECONCILIATION]: 'GSTR-2B Purchase Reconciliation',
      [ReportType.GSTR3B_SUMMARY]: 'GSTR-3B Summary Report',
      [ReportType.E_INVOICE_REGISTER]: 'E-Invoice Register',
      [ReportType.E_WAY_BILL_REGISTER]: 'E-Way Bill Register',
      [ReportType.HSN_SUMMARY]: 'HSN/SAC Wise Summary Report',
      [ReportType.GSTR9_ANNUAL_RETURN]: 'GSTR-9 Annual Return',
      [ReportType.GSTR9C_RECONCILIATION]: 'GSTR-9C Reconciliation Statement',
      [ReportType.RCM_REPORT]: 'Reverse Charge Mechanism Report',
      [ReportType.SALES_REGISTER]: 'Sales Register Report',
      [ReportType.PURCHASE_REGISTER]: 'Purchase Register Report',
      [ReportType.TDS_REPORT]: 'TDS Report',
      [ReportType.PROFIT_LOSS]: 'Profit & Loss Statement',
      [ReportType.BALANCE_SHEET]: 'Balance Sheet',
      [ReportType.FORM26AS_RECONCILIATION]: 'Form 26AS Reconciliation',
      [ReportType.DEPRECIATION_REGISTER]: 'Depreciation Register',
      [ReportType.AUDIT_TRAIL]: 'Audit Trail Report',
      [ReportType.CASH_BANK_BOOK]: 'Cash/Bank Book',
      [ReportType.LEDGER_REPORT]: 'Ledger Report',
      [ReportType.EXPENSE_CATEGORY]: 'Expense Category Report',
      [ReportType.RECONCILIATION_SUMMARY]: 'Reconciliation Summary Report'
    };

    return names[reportType] || 'Compliance Report';
  }

  // 🧾 GSTR-1 Outward Supplies Report
 private async generateGSTR1(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        status: In([InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.PARTIAL, InvoiceStatus.VIEWED]),
        deletedAt: IsNull()
      },
      relations: ['customer', 'items', 'taxDetails']
    });

    const reportData = {
      summary: {
        totalInvoices: invoices.length,
        totalTaxableValue: 0,
        totalTaxAmount: 0,
        totalCessAmount: 0,
        b2bCount: 0,
        b2cCount: 0,
        exportCount: 0
      },
      b2bInvoices: [] as any[],
      b2cInvoices: [] as any[],
      exportInvoices: [] as any[],
      hsnSummary: {} as Record<string, any>
    };

    for (const invoice of invoices) {
      const taxableValue = invoice.subTotal - (invoice.discountTotal || 0);
      const invoiceData = {
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        customer: invoice.customer?.name,
        customerGSTIN: invoice.customer?.gstin,
        taxableValue,
        cgst: 0,
        sgst: 0,
        igst: 0,
        cess: 0,
        totalAmount: invoice.totalAmount,
        placeOfSupply: invoice.customer?.billingAddress?.state || 'Not specified'
      };

      // Calculate tax breakdown
      if (invoice.taxDetails) {
        invoice.taxDetails.forEach(tax => {
          const taxAmount = tax.taxAmount;
          if (tax.taxName.includes('CGST')) invoiceData.cgst += taxAmount;
          else if (tax.taxName.includes('SGST')) invoiceData.sgst += taxAmount;
          else if (tax.taxName.includes('IGST')) invoiceData.igst += taxAmount;
          else if (tax.taxName.includes('CESS')) invoiceData.cess += taxAmount;
        });
      }

      // Categorize invoices - FIXED: Use country from billingAddress or default to India
      const customerCountry = invoice.customer?.billingAddress?.country || 'India';
      if (invoice.customer?.gstin) {
        if (customerCountry !== 'India') {
          reportData.exportInvoices.push(invoiceData);
          reportData.summary.exportCount++;
        } else {
          reportData.b2bInvoices.push(invoiceData);
          reportData.summary.b2bCount++;
        }
      } else {
        reportData.b2cInvoices.push(invoiceData);
        reportData.summary.b2cCount++;
      }

      // HSN Summary
      invoice.items.forEach(item => {
        const hsnCode = item.metadata?.hsnCode || '999999';
        if (!reportData.hsnSummary[hsnCode]) {
          reportData.hsnSummary[hsnCode] = {
            hsnCode,
            description: item.description,
            uqc: item.unit || 'NOS',
            totalQuantity: 0,
            taxableValue: 0,
            taxRate: item.taxRate,
            taxAmount: 0,
            cessAmount: 0
          };
        }

        const itemValue = item.unitPrice * item.quantity;
        reportData.hsnSummary[hsnCode].totalQuantity += item.quantity;
        reportData.hsnSummary[hsnCode].taxableValue += itemValue;
        reportData.hsnSummary[hsnCode].taxAmount += (item.taxAmount || 0);
      });

      // Update summary
      reportData.summary.totalTaxableValue += taxableValue;
      reportData.summary.totalTaxAmount += invoiceData.cgst + invoiceData.sgst + invoiceData.igst;
      reportData.summary.totalCessAmount += invoiceData.cess;
    }

    return reportData;
  }

  // 💰 GSTR-2B Purchase Reconciliation
  private async generateGSTR2B(tenantId: string, filters: any) {
    const purchases = await this.paymentRepository.find({
      where: {
        tenantId,
        paymentDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['vendor']
    });

    const reportData = {
      summary: {
        totalPurchases: purchases.length,
        totalPurchaseValue: 0,
        totalEligibleITC: 0,
        totalIneligibleITC: 0,
        totalITCAvailable: 0
      },
      vendorWiseSummary: [] as any[],
      purchases: [] as any[]
    };

    purchases.forEach(purchase => {
      const purchaseValue = purchase.amount;
      const itcEligible = purchaseValue * 0.18; // Assuming 18% GST
      const itcIneligible = purchaseValue * 0.02; // Assuming 2% ineligible

      reportData.summary.totalPurchaseValue += purchaseValue;
      reportData.summary.totalEligibleITC += itcEligible;
      reportData.summary.totalIneligibleITC += itcIneligible;
      reportData.summary.totalITCAvailable += itcEligible - itcIneligible;

      reportData.purchases.push({
        date: purchase.paymentDate,
        vendor: purchase.vendor?.name,
        vendorGSTIN: purchase.vendor?.gstin,
        invoiceNumber: purchase.referenceNumber,
        taxableValue: purchaseValue,
        itcEligible,
        itcIneligible,
        itcAvailable: itcEligible - itcIneligible,
        reconciliationStatus: purchase.vendor?.gstin ? 'Matched' : 'Pending'
      });
    });

    // Vendor-wise summary
    const vendorMap = new Map();
    reportData.purchases.forEach(purchase => {
      const vendorKey = purchase.vendorGSTIN || purchase.vendor;
      if (!vendorMap.has(vendorKey)) {
        vendorMap.set(vendorKey, {
          vendorName: purchase.vendor,
          vendorGSTIN: purchase.vendorGSTIN,
          totalPurchases: 0,
          totalAmount: 0,
          eligibleITC: 0,
          ineligibleITC: 0
        });
      }
      
      const vendorSummary = vendorMap.get(vendorKey);
      vendorSummary.totalPurchases++;
      vendorSummary.totalAmount += purchase.taxableValue;
      vendorSummary.eligibleITC += purchase.itcEligible;
      vendorSummary.ineligibleITC += purchase.itcIneligible;
    });

    reportData.vendorWiseSummary = Array.from(vendorMap.values());

    return reportData;
  }

  // 📊 GSTR-3B Summary Report
  private async generateGSTR3B(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['taxDetails']
    });

    const payments = await this.paymentRepository.find({
      where: {
        tenantId,
        paymentDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      }
    });

    let outwardSupply = 0;
    let outwardTax = 0;
    let cgst = 0, sgst = 0, igst = 0, cess = 0;

    invoices.forEach(invoice => {
      const taxableValue = invoice.subTotal - (invoice.discountTotal || 0);
      outwardSupply += taxableValue;
      outwardTax += invoice.taxTotal;

      // Calculate tax breakdown
      if (invoice.taxDetails) {
        invoice.taxDetails.forEach(tax => {
          if (tax.taxName.includes('CGST')) cgst += tax.taxAmount;
          else if (tax.taxName.includes('SGST')) sgst += tax.taxAmount;
          else if (tax.taxName.includes('IGST')) igst += tax.taxAmount;
          else if (tax.taxName.includes('CESS')) cess += tax.taxAmount;
        });
      }
    });

    let itcAvailable = 0;
    let itcClaimed = 0;

    payments.forEach(payment => {
      itcAvailable += payment.amount * 0.18; // Simplified ITC calculation
      itcClaimed += payment.amount * 0.15;
    });

    const taxLiability = {
      outwardSupply,
      outwardTax,
      cgst,
      sgst,
      igst,
      cess
    };

    const itcDetails = {
      available: itcAvailable,
      claimed: itcClaimed,
      reversed: itcAvailable - itcClaimed,
      ineligible: itcAvailable * 0.1
    };

    return {
      taxLiability,
      itcDetails,
      netPayable: outwardTax - itcClaimed,
      dueDate: new Date(new Date(filters.toDate).getTime() + 20 * 24 * 60 * 60 * 1000),
      summary: {
        totalInvoices: invoices.length,
        totalPurchases: payments.length,
        netTaxLiability: outwardTax - itcClaimed
      }
    };
  }

  // 🧾 Sales Register Report
  private async generateSalesRegister(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['customer', 'items', 'payments', 'taxDetails']
    });

    const records = invoices.map(invoice => {
      const taxableValue = invoice.subTotal - (invoice.discountTotal || 0);
      const cgst = invoice.taxDetails?.find(t => t.taxName.includes('CGST'))?.taxAmount || 0;
      const sgst = invoice.taxDetails?.find(t => t.taxName.includes('SGST'))?.taxAmount || 0;
      const igst = invoice.taxDetails?.find(t => t.taxName.includes('IGST'))?.taxAmount || 0;

      return {
        date: invoice.issueDate,
        invoiceNo: invoice.invoiceNumber,
        customer: invoice.customer?.name,
        customerGSTIN: invoice.customer?.gstin,
        taxableValue,
        cgst,
        sgst,
        igst,
        totalAmount: invoice.totalAmount,
        paymentStatus: invoice.status,
        paymentDate: invoice.paidDate,
        placeOfSupply: invoice.customer?.billingAddress?.state || 'Not specified'
      };
    });

    return {
      summary: {
        totalInvoices: invoices.length,
        totalTaxableValue: records.reduce((sum, r) => sum + r.taxableValue, 0),
        totalTax: records.reduce((sum, r) => sum + r.cgst + r.sgst + r.igst, 0),
        totalAmount: records.reduce((sum, r) => sum + r.totalAmount, 0)
      },
      records
    };
  }

  // 📊 TDS Report
  private async generateTDSReport(tenantId: string, filters: any) {
    const payments = await this.paymentRepository.find({
      where: {
        tenantId,
        paymentDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['vendor']
    });

    const tdsSections = {
      '194C': { rate: 2, description: 'Payment to Contractors' },
      '194I': { rate: 10, description: 'Rent' },
      '194J': { rate: 10, description: 'Professional/Technical Fees' },
      '194H': { rate: 5, description: 'Commission/Brokerage' }
    };

    const report: any = {
      summary: {
        totalPayments: payments.length,
        totalAmount: 0,
        totalTDS: 0
      },
      sections: {} as Record<string, any>
    };

    payments.forEach(payment => {
      const section = this.determineTDSSection(payment);
      if (!report.sections[section]) {
        report.sections[section] = {
          section,
          description: tdsSections[section as keyof typeof tdsSections]?.description || 'Other',
          rate: tdsSections[section as keyof typeof tdsSections]?.rate || 10,
          totalAmount: 0,
          tdsAmount: 0,
          transactions: []
        };
      }

      const tdsAmount = payment.amount * (report.sections[section].rate / 100);
      report.sections[section].totalAmount += payment.amount;
      report.sections[section].tdsAmount += tdsAmount;
      report.sections[section].transactions.push({
        date: payment.paymentDate,
        vendor: payment.vendor?.name,
        pan: payment.vendor?.pan,
        amount: payment.amount,
        tds: tdsAmount,
        paymentMode: payment.method
      });

      report.summary.totalAmount += payment.amount;
      report.summary.totalTDS += tdsAmount;
    });

    return report;
  }

  // 🔍 Audit Trail Report
 private async generateAuditTrail(tenantId: string, filters: any) {
    const auditLogs = await this.auditLogRepository.find({
      where: {
        tenantId,
        timestamp: Between(new Date(filters.fromDate), new Date(filters.toDate))
      },
      order: { timestamp: 'DESC' },
      take: 1000,
      relations: ['performedBy']
    });


    const records = auditLogs.map(log => ({
      timestamp: log.timestamp,
      // FIXED: Use user's name property
    //   user: (log.performedBy as User)?.name || 'System',
user: (() => {
  if (!log.performedBy) return 'System';

  const performer: any = log.performedBy;

  if ('firstName' in performer && 'lastName' in performer) {
    // User entity
    return `${performer.firstName} ${performer.lastName}`;
  } else if ('first_name' in performer && 'last_name' in performer) {
    // SuperAdmin entity
    return `${performer.first_name} ${performer.last_name}`;
  }

  return 'System';
})(),
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      oldValues: log.details?.oldValues,
      newValues: log.details?.newValues,
      ipAddress: log.ipAddress
    }));

    return {
      summary: {
        totalRecords: auditLogs.length,
        period: `${filters.fromDate} to ${filters.toDate}`,
        uniqueUsers: new Set(auditLogs.map(log => log.performedById)).size
      },
      records
    };
  }

  // 💰 Profit & Loss Statement
  private async generateProfitLoss(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      }
    });

    const expenses = await this.expenseRepository.find({
      where: {
        tenantId,
        expenseDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      }
    });

    const revenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const grossProfit = revenue - totalExpenses;
    const taxRate = 0.3; // 30%
    const taxAmount = grossProfit * taxRate;
    const netProfit = grossProfit - taxAmount;

    return {
      summary: {
        revenue,
        totalExpenses,
        grossProfit,
        taxAmount,
        netProfit,
        period: `${filters.fromDate} to ${filters.toDate}`
      },
      revenueBreakdown: {
        productSales: revenue * 0.7,
        serviceRevenue: revenue * 0.3
      },
      expenseBreakdown: expenses.reduce((acc, exp) => {
        const category = exp.category || 'Other';
        if (!acc[category]) acc[category] = 0;
        acc[category] += exp.amount;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // 🏦 Cash/Bank Book
 private async generateCashBankBook(tenantId: string, filters: any) {
    const payments = await this.paymentRepository.find({
      where: {
        tenantId,
        paymentDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['vendor', 'customer']
    });

    const cashTransactions = payments.filter(p => p.method === PaymentMethod.CASH);
    const bankTransactions = payments.filter(p => p.method !== PaymentMethod.CASH);

    const records = payments.map(p => ({
      date: p.paymentDate,
      // FIXED: Use paymentType instead of paymentType
      type: p.paymentType,
      reference: p.referenceNumber,
      description: p.notes,
      party: p.vendor?.name || p.customer?.name || 'N/A',
      method: p.method,
      amount: p.amount,
      status: p.status
    }));

    return {
      summary: {
        totalTransactions: payments.length,
        cashTotal: cashTransactions.reduce((sum, p) => sum + p.amount, 0),
        bankTotal: bankTransactions.reduce((sum, p) => sum + p.amount, 0),
        openingBalance: 0,
        closingBalance: 0
      },
      records
    };
  }


  // 🧾 HSN Summary Report
  private async generateHSNSummary(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['items']
    });

    const hsnSummary: Record<string, any> = {};

    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const hsnCode = item.metadata?.hsnCode || '999999';
        if (!hsnSummary[hsnCode]) {
          hsnSummary[hsnCode] = {
            hsnCode,
            description: this.getHSNDescription(hsnCode),
            uqc: item.unit || 'NOS',
            totalQuantity: 0,
            taxableValue: 0,
            taxRate: item.taxRate,
            taxAmount: 0,
            cessAmount: 0
          };
        }

        const itemValue = item.unitPrice * item.quantity;
        hsnSummary[hsnCode].totalQuantity += item.quantity;
        hsnSummary[hsnCode].taxableValue += itemValue;
        hsnSummary[hsnCode].taxAmount += (item.taxAmount || 0);
      });
    });

    return {
      summary: {
        totalHSNCodes: Object.keys(hsnSummary).length,
        totalTaxableValue: Object.values(hsnSummary).reduce((sum: number, item: any) => sum + item.taxableValue, 0),
        totalTaxAmount: Object.values(hsnSummary).reduce((sum: number, item: any) => sum + item.taxAmount, 0)
      },
      hsnDetails: Object.values(hsnSummary)
    };
  }

  // 🧾 E-Invoice Register
  private async generateEInvoiceRegister(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['customer']
    });

    const records = invoices.map(invoice => ({
      irn: invoice.metadata?.irn || 'Not Generated',
      ackNo: invoice.metadata?.ackNo,
      ackDate: invoice.metadata?.ackDate,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.issueDate,
      customer: invoice.customer?.name,
      customerGSTIN: invoice.customer?.gstin,
      taxableValue: invoice.subTotal - (invoice.discountTotal || 0),
      taxAmount: invoice.taxTotal,
      totalAmount: invoice.totalAmount,
      status: invoice.metadata?.eInvoiceStatus || 'Pending',
      cancelReason: invoice.metadata?.cancelReason
    }));

    return {
      summary: {
        totalInvoices: invoices.length,
        generatedIRN: records.filter(r => r.irn !== 'Not Generated').length,
        cancelledIRN: records.filter(r => r.status === 'Cancelled').length,
        totalValue: records.reduce((sum, r) => sum + r.totalAmount, 0)
      },
      records
    };
  }

  // Additional report methods with simplified implementations
  private async generateEWayBillRegister(tenantId: string, filters: any) {
    const invoices = await this.invoiceRepository.find({
      where: {
        tenantId,
        issueDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['customer']
    });

    return {
      summary: {
        totalInvoices: invoices.length,
        ewayBillGenerated: invoices.filter(inv => inv.metadata?.ewayBillNo).length,
        totalValue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
      },
      records: invoices.map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        date: inv.issueDate,
        customer: inv.customer?.name,
        distance: inv.metadata?.distance || 0,
        vehicleNo: inv.metadata?.vehicleNo,
        ewayBillNo: inv.metadata?.ewayBillNo,
        ewayBillDate: inv.metadata?.ewayBillDate,
        status: inv.metadata?.ewayBillStatus || 'Not Generated'
      }))
    };
  }

  private async generatePurchaseRegister(tenantId: string, filters: any) {
    const payments = await this.paymentRepository.find({
      where: {
        tenantId,
        paymentDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      },
      relations: ['vendor']
    });

    return {
      summary: {
        totalPurchases: payments.length,
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0)
      },
      records: payments.map(p => ({
        date: p.paymentDate,
        billNo: p.referenceNumber,
        vendor: p.vendor?.name,
        vendorGSTIN: p.vendor?.gstin,
        taxableValue: p.amount,
        taxAmount: p.amount * 0.18,
        totalAmount: p.amount * 1.18,
        paymentMode: p.method
      }))
    };
  }

  private async generateGSTR9(tenantId: string, filters: any) {
    // Simplified GSTR-9 implementation
    return {
      summary: {
        period: `${filters.fromDate} to ${filters.toDate}`,
        totalTaxLiability: 0,
        totalITC: 0,
        netTaxPayable: 0
      },
      sections: {
        outwardSupplies: {},
        inwardSupplies: {},
        itcDetails: {}
      }
    };
  }

  private async generateGSTR9C(tenantId: string, filters: any) {
    return {
      summary: {
        period: `${filters.fromDate} to ${filters.toDate}`,
        reconciliationStatus: 'Pending'
      },
      discrepancies: []
    };
  }

  private async generateRCMReport(tenantId: string, filters: any) {
    return {
      summary: {
        totalRCMTransactions: 0,
        totalRCMTax: 0
      },
      transactions: []
    };
  }

  private async generateBalanceSheet(tenantId: string, filters: any) {
    const asOfDate = new Date(filters.toDate);
    
    return {
      summary: {
        asOfDate: asOfDate.toLocaleDateString(),
        totalAssets: 0,
        totalLiabilities: 0,
        equity: 0
      },
      assets: {
        currentAssets: 0,
        fixedAssets: 0
      },
      liabilities: {
        currentLiabilities: 0,
        longTermLiabilities: 0
      }
    };
  }

  private async generateForm26AS(tenantId: string, filters: any) {
    return {
      summary: {
        pan: 'ABCTY1234D',
        financialYear: '2023-24',
        totalTDS: 0,
        totalTCS: 0
      },
      tdsDetails: [],
      tcsDetails: []
    };
  }

  private async generateDepreciationRegister(tenantId: string, filters: any) {
    return {
      summary: {
        totalAssets: 0,
        totalDepreciation: 0
      },
      assets: []
    };
  }

  private async generateLedgerReport(tenantId: string, filters: any) {
    return {
      summary: {
        totalAccounts: 0,
        period: `${filters.fromDate} to ${filters.toDate}`
      },
      accounts: []
    };
  }

  private async generateExpenseCategory(tenantId: string, filters: any) {
    const expenses = await this.expenseRepository.find({
      where: {
        tenantId,
        expenseDate: Between(new Date(filters.fromDate), new Date(filters.toDate)),
        deletedAt: IsNull()
      }
    });

    const categorySummary = expenses.reduce((acc, exp) => {
      const category = exp.category || 'Uncategorized';
      if (!acc[category]) acc[category] = 0;
      acc[category] += exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: {
        totalExpenses: expenses.length,
        totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        categoriesCount: Object.keys(categorySummary).length
      },
      categoryBreakdown: categorySummary,
      expenses: expenses.map(exp => ({
        date: exp.expenseDate,
        category: exp.category,
        description: exp.description,
        amount: exp.amount,
        paymentMode: exp.paymentMethod
      }))
    };
  }

  private async generateReconciliationSummary(tenantId: string, filters: any) {
    return {
      summary: {
        bankAccounts: 0,
        reconciled: 0,
        pending: 0
      },
      accounts: []
    };
  }

  private async generateGenericReport(tenantId: string, filters: any) {
    return {
      summary: {
        message: 'Report data available',
        period: `${filters.fromDate} to ${filters.toDate}`,
        recordCount: 0
      },
      data: []
    };
  }

  // Helper Methods
  private getHSNDescription(hsnCode: string): string {
    const hsnDescriptions: Record<string, string> = {
      '999999': 'Other Services',
      '9983': 'Business Services',
      '9984': 'Telecommunication Services',
      '9985': 'Construction Services',
      '9986': 'Financial Services',
      '9987': 'Software Services'
    };
    return hsnDescriptions[hsnCode] || 'Goods/Services';
  }

  private determineTDSSection(payment: PaymentInvoice): string {
    if (payment.notes?.includes('rent')) return '194I';
    if (payment.notes?.includes('professional') || payment.notes?.includes('fee')) return '194J';
    if (payment.notes?.includes('commission')) return '194H';
    return '194C';
  }

  // Export methods remain the same as before...
//   private async exportReport(data: any, reportType: ReportType, format: ReportFormat, filters: any): Promise<string> {
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const fileName = `${reportType}_${timestamp}`;
//     const reportsDir = path.join(process.cwd(), 'reports', 'generated');

//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir, { recursive: true });
//     }

//     switch (format) {
//       case ReportFormat.EXCEL:
//         return await this.exportToExcel(data, reportsDir, fileName, reportType);
//       case ReportFormat.PDF:
//         return await this.exportToPDF(data, reportsDir, fileName, reportType);
//       case ReportFormat.JSON:
//         return await this.exportToJSON(data, reportsDir, fileName);
//       case ReportFormat.CSV:
//         return await this.exportToCSV(data, reportsDir, fileName, reportType);
//       default:
//         throw new Error(`Unsupported format: ${format}`);
//     }
//   }

private async exportReport(data: any, reportType: ReportType, format: ReportFormat, filters: any): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${reportType}_${timestamp}`;
  const reportsDir = path.join(process.cwd(), 'reports', 'generated');

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Always generate a JSON copy for frontend previews
  await this.exportToJSON(data, reportsDir, fileName);

  switch (format) {
    case ReportFormat.EXCEL:
      return await this.exportToExcel(data, reportsDir, fileName, reportType);
    case ReportFormat.PDF:
      return await this.exportToPDF(data, reportsDir, fileName, reportType);
    case ReportFormat.JSON:
      return await this.exportToJSON(data, reportsDir, fileName);
    case ReportFormat.CSV:
      return await this.exportToCSV(data, reportsDir, fileName, reportType);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}


  private async exportToExcel(data: any, dir: string, fileName: string, reportType: ReportType): Promise<string> {
    const filePath = path.join(dir, `${fileName}.xlsx`);
    const workbook = new ExcelJS.Workbook();

    // Summary sheet
const summarySheet = this.getOrAddWorksheet(workbook, 'Summary');
this.addExcelSummary(summarySheet, data, reportType);

// Data sheets for arrays
Object.keys(data).forEach(key => {
  if (Array.isArray(data[key]) && data[key].length > 0) {
    const dataSheet = this.getOrAddWorksheet(workbook, this.formatKey(key));
    this.addExcelData(dataSheet, data[key]);
  } else if (typeof data[key] === 'object' && data[key] !== null) {
    const objData = data[key];
    if (Object.keys(objData).length > 0) {
      const arrayData = Object.values(objData);
      if (Array.isArray(arrayData) && arrayData.length > 0) {
        const dataSheet = this.getOrAddWorksheet(workbook, this.formatKey(key));
        this.addExcelData(dataSheet, arrayData);
      }
    }
  }
});

    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

private getOrAddWorksheet(workbook: ExcelJS.Workbook, name: string): ExcelJS.Worksheet {
  let sheet = workbook.getWorksheet(name);
  if (!sheet) {
    sheet = workbook.addWorksheet(name);
  } else {
    // Avoid duplicates by appending suffix if needed
    let counter = 1;
    let newName = `${name}_${counter}`;
    while (workbook.getWorksheet(newName)) {
      counter++;
      newName = `${name}_${counter}`;
    }
    sheet = workbook.addWorksheet(newName);
  }
  return sheet;
}



  private addExcelSummary(worksheet: ExcelJS.Worksheet, data: any, reportType: ReportType) {
    worksheet.addRow([this.getReportName(reportType)]);
    worksheet.addRow(['Generated on', new Date().toLocaleDateString()]);
    worksheet.addRow([]);

    if (data.summary) {
      worksheet.addRow(['Summary']);
      Object.keys(data.summary).forEach(key => {
        worksheet.addRow([this.formatKey(key), data.summary[key]]);
      });
    }
  }

  private addExcelData(worksheet: ExcelJS.Worksheet, records: any[]) {
    if (records.length === 0) return;

    const headers = Object.keys(records[0]);
    worksheet.addRow(headers.map(h => this.formatKey(h)));
    
    records.forEach(record => {
      worksheet.addRow(headers.map(header => record[header]));
    });
  }

  private async exportToPDF(data: any, dir: string, fileName: string, reportType: ReportType): Promise<string> {
    const filePath = path.join(dir, `${fileName}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text(this.getReportName(reportType), 100, 100);
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 100, 130);

    let yPosition = 180;
    if (data.summary) {
      doc.fontSize(16).text('Summary', 100, yPosition);
      yPosition += 30;
      Object.keys(data.summary).forEach(key => {
        doc.text(`${this.formatKey(key)}: ${data.summary[key]}`, 100, yPosition);
        yPosition += 20;
      });
    }

    doc.end();
    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  private async exportToJSON(data: any, dir: string, fileName: string): Promise<string> {
    const filePath = path.join(dir, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  private async exportToCSV(data: any, dir: string, fileName: string, reportType: ReportType): Promise<string> {
    const filePath = path.join(dir, `${fileName}.csv`);
    let csvContent = `"${this.getReportName(reportType)}"\n`;
    csvContent += `"Generated on: ${new Date().toLocaleDateString()}"\n\n`;

    if (data.summary) {
      csvContent += '"Summary"\n';
      Object.keys(data.summary).forEach(key => {
        csvContent += `"${this.formatKey(key)}","${data.summary[key]}"\n`;
      });
      csvContent += '\n';
    }

    // Export first array found
    const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
    if (arrayKey && data[arrayKey].length > 0) {
      const records = data[arrayKey];
      const headers = Object.keys(records[0]);
      csvContent += headers.map(h => `"${this.formatKey(h)}"`).join(',') + '\n';
      records.forEach((record: any) => {
        csvContent += headers.map(header => `"${record[header]}"`).join(',') + '\n';
      });
    }

    fs.writeFileSync(filePath, csvContent);
    return filePath;
  }

  private formatKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  // Get report history for tenant
  async getReportHistory(tenantId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Report>> {
    const skip = (page - 1) * limit;
    const [reports, total] = await this.reportRepository.findAndCount({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });

    return {
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get specific report by ID
  async getReportById(tenantId: string, reportId: string): Promise<Report | null> {
    return await this.reportRepository.findOne({
      where: { id: reportId, tenantId }
    });
  }

  // Delete report
  async deleteReport(tenantId: string, reportId: string): Promise<void> {
    const report = await this.getReportById(tenantId, reportId);
    if (report && report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }
    await this.reportRepository.delete({ id: reportId, tenantId });
  }
}
