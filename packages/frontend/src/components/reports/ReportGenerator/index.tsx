import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { ReportType, ReportFormat, ReportFilters } from '../../../types/report';
import { useReportService } from '../../../hooks/useReportService';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  onReportGenerated?: (reportId: string) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onReportGenerated }) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>(ReportType.GSTR1_OUTWARD_SUPPLIES);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>(ReportFormat.EXCEL);
  const [filters, setFilters] = useState<ReportFilters>({
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });

  const { generateReport, loading } = useReportService();

  const reportTypes = [
    { value: ReportType.GSTR1_OUTWARD_SUPPLIES, label: 'GSTR-1 Outward Supplies' },
    { value: ReportType.GSTR3B_SUMMARY, label: 'GSTR-3B Summary' },
    { value: ReportType.SALES_REGISTER, label: 'Sales Register' },
    { value: ReportType.PURCHASE_REGISTER, label: 'Purchase Register' },
    { value: ReportType.HSN_SUMMARY, label: 'HSN Summary' },
    { value: ReportType.TDS_REPORT, label: 'TDS Report' },
    { value: ReportType.AUDIT_TRAIL, label: 'Audit Trail' },
  ];

  const formatOptions = [
    { value: ReportFormat.EXCEL, label: 'Excel (.xlsx)' },
    { value: ReportFormat.PDF, label: 'PDF (.pdf)' },
    { value: ReportFormat.CSV, label: 'CSV (.csv)' },
    { value: ReportFormat.JSON, label: 'JSON (.json)' },
  ];

  const handleGenerate = async () => {
    try {
      const report = await generateReport({
        type: selectedReport,
        format: selectedFormat,
        filters
      });

      toast.success(`Report "${report.name}" is being generated`);
      onReportGenerated?.(report.id);
    } catch (error:any) {
      toast.error(error?.message || 'Failed to generate report');
      // Error handled in the service hook
    }
  };

  const handleFiltersChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Report</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
    <div className="flex flex-col space-y-1">
  <label className="text-sm font-medium text-gray-700">Report Type</label>
  <Select value={selectedReport} onValueChange={(value) => setSelectedReport(value as ReportType)}>
    <SelectTrigger>
      <SelectValue placeholder="Select report type" />
    </SelectTrigger>
    <SelectContent>
      {reportTypes.map((r) => (
        <SelectItem key={r.value} value={r.value}>
          {r.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
          
<div className="flex flex-col space-y-1">
  <label className="text-sm font-medium text-gray-700">Output Format</label>
  <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as ReportFormat)}>
    <SelectTrigger>
      <SelectValue placeholder="Select format" />
    </SelectTrigger>
    <SelectContent>
      {formatOptions.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
              required
            />
            
            <Input
              label="To Date"
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Report Description</h4>
            <p className="text-sm text-gray-600">
              {getReportDescription(selectedReport)}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Usage Tips</h4>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Select appropriate date range for accurate data</li>
              <li>Excel format recommended for data analysis</li>
              <li>PDF format suitable for official submissions</li>
              <li>Reports are generated asynchronously</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
              toDate: new Date().toISOString().split('T')[0],
            });
          }}
        >
          Reset Filters
        </Button>
        
        <Button
          onClick={handleGenerate}
          isLoading={loading}
          disabled={loading}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

const getReportDescription = (reportType: ReportType): string => {
const descriptions: Partial<Record<ReportType, string>> = {
  [ReportType.GSTR1_OUTWARD_SUPPLIES]: 'Detailed report of all outward supplies for GST return filing. Includes B2B, B2C transactions and HSN summary.',
  [ReportType.GSTR3B_SUMMARY]: 'Monthly return summary showing tax liability, input tax credit, and net payable amount.',
  [ReportType.SALES_REGISTER]: 'Comprehensive sales transaction register with GST breakdown and customer details.',
  [ReportType.PURCHASE_REGISTER]: 'Complete purchase records with vendor information and input tax credit details.',
  [ReportType.HSN_SUMMARY]: 'HSN/SAC code wise summary of goods and services for GST reporting.',
  [ReportType.TDS_REPORT]: 'Tax deducted at source report with section-wise breakdown and vendor details.',
  [ReportType.AUDIT_TRAIL]: 'Complete audit trail of all system activities and modifications.',
};
  
  return descriptions[reportType] || 'Generate detailed compliance report for the selected period.';
};

export default ReportGenerator;
