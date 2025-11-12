import React, { useState, useEffect } from 'react';
import { Report, GSTR1ReportData, ReportType, ReportStatus, GSTR3BReportData, SalesRegisterReportData } from '../../../types/report';
import { useReportService } from '../../../hooks/useReportService';
import { Download, Printer, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
 
interface ReportViewerProps {
  report: Report;
  onClose: () => void;
}
 
const ReportViewer: React.FC<ReportViewerProps> = ({ report, onClose }) => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getReportData, downloadReport } = useReportService();
 
  useEffect(() => {
    loadReportData();
  }, [report.id]);
 
  const loadReportData = async () => {
    try {
      setLoading(true);
      const response = await getReportData(report.id);
      
      if (response instanceof Blob || response instanceof ArrayBuffer) {
        console.warn("Report returned as file, no preview possible.");
        setReportData(null);
        return;
      }
      
      setReportData(response.data || response);
    } catch (error: any) {
      console.error("Failed to load report:", error);
      toast.error(error?.message || "Failed to load report");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };
 
const handleDownload = async () => {
  if (report.status !== ReportStatus.COMPLETED) {
    alert('Report is not ready for download');
    return;
  }
  try {
    await downloadReport(report.id, report.name, report.format);
  } catch (error: any) {
    toast.error(error?.message || 'Failed to download report');
    // handled in service
  }
};
 
  const handlePrint = () => {
    window.print();
  };
 
  // Generic Summary Component
const renderSummary = (data: any) => {
  if (!data || !data.summary) return null;

  const summary = data.summary;
  const summaryItems = Object.entries(summary).filter(
    ([, value]) => typeof value === 'number' || typeof value === 'string'
  );

  if (summaryItems.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {summaryItems.map(([key, value], index) => {
        let displayValue: string;

        if (typeof value === 'number') {
          displayValue =
            key.toLowerCase().includes('amount') ||
            key.toLowerCase().includes('value')
              ? `₹${value.toLocaleString()}`
              : value.toLocaleString();
        } else if (typeof value === 'string') {
          displayValue = value;
        } else {
          displayValue = '-';
        }

        return (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
            <div className="text-xl font-semibold">{displayValue}</div>
          </div>
        );
      })}
    </div>
  );
};

 
  // Generic Table Component
  const renderDataTable = (data: any[], title: string) => {
    if (!data || data.length === 0) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">{title} (0)</h3>
          <div className="text-center py-4 text-gray-500">No data available</div>
        </div>
      );
    }
 
    const columns = Object.keys(data[0]).filter(key =>
      !key.toLowerCase().includes('id') &&
      !key.toLowerCase().includes('metadata')
    );
 
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">{title} ({data.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {column.replace(/([A-Z])/g, ' $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 50).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {typeof row[column] === 'number'
                        ? (column.toLowerCase().includes('amount') || column.toLowerCase().includes('value') || column.toLowerCase().includes('rate'))
                          ? `₹${row[column].toLocaleString()}`
                          : row[column].toLocaleString()
                        : row[column] || '-'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 50 && (
            <div className="text-center py-2 text-sm text-gray-500">
              Showing first 50 of {data.length} records
            </div>
          )}
        </div>
      </div>
    );
  };
 
  // Specific report renderers
  const renderGSTR1Report = (data: GSTR1ReportData) => {
    return (
      <div className="space-y-6">
        {renderSummary(data)}
        {renderDataTable(data.b2bInvoices || [], 'B2B Invoices')}
        {renderDataTable(data.b2cInvoices || [], 'B2C Invoices')}
        {data.hsnSummary && renderDataTable(Object.values(data.hsnSummary), 'HSN Summary')}
      </div>
    );
  };
 
  const renderGSTR3BReport = (data: GSTR3BReportData) => {
    return (
      <div className="space-y-6">
        {renderSummary(data)}
        {data.taxLiability && renderDataTable([data.taxLiability], 'Tax Liability')}
        {data.itcDetails && renderDataTable([data.itcDetails], 'ITC Details')}
      </div>
    );
  };
 
  const renderSalesRegisterReport = (data: SalesRegisterReportData[] | any) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No sales data available for this report
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderSummary({ summary: { totalRecords: data.length } })}
      {renderDataTable(data, 'Sales Records')}
    </div>
  );
};

 
  // Generic report renderer for any report type
  const renderGenericReport = (data: any) => {
    if (!data) return null;
 
    const sections = [];
 
    // Add summary if available
    if (data.summary) {
      sections.push(
        <div key="summary">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          {renderSummary(data)}
        </div>
      );
    }
 
    // Find array data sections
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        sections.push(
          <div key={key}>
            {renderDataTable(data[key], key.replace(/([A-Z])/g, ' $1'))}
          </div>
        );
      } else if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
        // Handle object sections (like hsnSummary)
        const objData = data[key];
        if (Object.keys(objData).length > 0) {
          const arrayData = Object.values(objData);
          if (Array.isArray(arrayData) && arrayData.length > 0) {
            sections.push(
              <div key={key}>
                {renderDataTable(arrayData, key.replace(/([A-Z])/g, ' $1'))}
              </div>
            );
          }
        }
      }
    });
 
    return sections.length > 0 ? (
      <div className="space-y-6">{sections}</div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        No structured data available for preview
      </div>
    );
  };
 
  const renderReportContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading report data...</div>;
    }
 
    if (!reportData) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Preview Not Available</h3>
          <p className="mt-2 text-sm text-gray-600">
            Preview is not available for this report. Please download the report to view the contents.
          </p>
        </div>
      );
    }
 
    // Use specific renderers for known report types, fallback to generic
    switch (report.type) {
      case ReportType.GSTR1_OUTWARD_SUPPLIES:
        return renderGSTR1Report(reportData as GSTR1ReportData);
      
      case ReportType.GSTR3B_SUMMARY:
        return renderGSTR3BReport(reportData as GSTR3BReportData);
      
      case ReportType.SALES_REGISTER:
        return renderSalesRegisterReport(reportData as SalesRegisterReportData[]);
      
      case ReportType.PURCHASE_REGISTER:
      case ReportType.GSTR2B_PURCHASE_RECONCILIATION:
      case ReportType.E_INVOICE_REGISTER:
      case ReportType.E_WAY_BILL_REGISTER:
      case ReportType.HSN_SUMMARY:
      case ReportType.GSTR9_ANNUAL_RETURN:
      case ReportType.GSTR9C_RECONCILIATION:
      case ReportType.RCM_REPORT:
      case ReportType.TDS_REPORT:
      case ReportType.PROFIT_LOSS:
      case ReportType.BALANCE_SHEET:
      case ReportType.FORM26AS_RECONCILIATION:
      case ReportType.DEPRECIATION_REGISTER:
      case ReportType.AUDIT_TRAIL:
      case ReportType.CASH_BANK_BOOK:
      case ReportType.LEDGER_REPORT:
      case ReportType.EXPENSE_CATEGORY:
      case ReportType.RECONCILIATION_SUMMARY:
        return renderGenericReport(reportData);
      
      default:
        return renderGenericReport(reportData);
    }
  };
 
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{report.name}</h2>
          <p className="text-sm text-gray-600">
            Generated on {new Date(report.generatedAt || report.createdAt).toLocaleDateString()}
            {report.recordCount && ` • ${report.recordCount.toLocaleString()} records`}
            {report.status && ` • Status: ${report.status}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={16} />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={report.status !== ReportStatus.COMPLETED}>
            <Download size={16} />
            Download
          </Button>
        </div>
      </div>
 
      {/* Content */}
      <div className="p-6 max-h-screen-80 overflow-y-auto">
        {renderReportContent()}
      </div>
 
      {/* Footer */}
      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Report ID: {report.id} • Type: {report.type}
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
 
export default ReportViewer;