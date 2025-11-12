import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Report, ReportStatus, ReportType } from '../../../types/report';
import { useReportService } from '../../../hooks/useReportService';
// import { Badge } from '../../common/Badge';
import { Badge } from '@/components/ui/Badge';
import { Download, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ReportHistoryProps {
  onViewReport: (report: Report) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ onViewReport }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { getReportHistory, downloadReport } = useReportService();

  useEffect(() => {
    fetchReports();
  }, [pagination.page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReportHistory(pagination.page, pagination.limit);
      setReports(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error: any) {
      toast(error?.message || 'Failed to fetch reports');
      // Error handled in service hook
    } finally {
      setLoading(false);
    }
  };

const handleDownload = async (report: Report) => {
  if (report.status !== ReportStatus.COMPLETED) {
    alert('Report is not ready for download');
    return;
  }

  try {
    await downloadReport(report.id, report.name, report.format);
  } catch (error: any) {
    toast(error?.message || 'Failed to download report');
    // handled in service
  }
};

  const getStatusBadge = (status: ReportStatus) => {
    const statusConfig = {
      [ReportStatus.PENDING]: { color: 'yellow', label: 'Pending' },
      [ReportStatus.GENERATING]: { color: 'blue', label: 'Generating' },
      [ReportStatus.COMPLETED]: { color: 'green', label: 'Completed' },
      [ReportStatus.FAILED]: { color: 'red', label: 'Failed' },
    };
    
    const config = statusConfig[status];
 return (
  <Badge
    className={`bg-${config.color}-100 text-${config.color}-800 border border-${config.color}-200`}
  >
    {config.label}
  </Badge>
);
  };

const getTypeLabel = (type: ReportType): string => {
  const typeLabels: Partial<Record<ReportType, string>> = {
    [ReportType.GSTR1_OUTWARD_SUPPLIES]: 'GSTR-1',
    [ReportType.GSTR3B_SUMMARY]: 'GSTR-3B',
    [ReportType.SALES_REGISTER]: 'Sales Register',
    [ReportType.PURCHASE_REGISTER]: 'Purchase Register',
    [ReportType.HSN_SUMMARY]: 'HSN Summary',
    [ReportType.TDS_REPORT]: 'TDS Report',
    [ReportType.AUDIT_TRAIL]: 'Audit Trail',
    [ReportType.GSTR2B_PURCHASE_RECONCILIATION]: 'GSTR-2B Reconciliation',
    [ReportType.E_INVOICE_REGISTER]: 'E-Invoice Register',
    [ReportType.E_WAY_BILL_REGISTER]: 'E-Way Bill Register',
    [ReportType.GSTR9_ANNUAL_RETURN]: 'GSTR-9 Annual Return',
    [ReportType.GSTR9C_RECONCILIATION]: 'GSTR-9C Reconciliation',
    // You can keep adding more if needed
  };

  return typeLabels[type] ?? type;
};



  const columns = [
    {
      key: 'name',
      header: 'Report Name',
      render: (value: string, row: Report) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{getTypeLabel(row.type)}</div>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: ReportStatus) => getStatusBadge(value)
    },
    {
      key: 'recordCount',
      header: 'Records',
      render: (value: number) => value ? value.toLocaleString() : '-'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, row: Report) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReport(row)}
            disabled={row.status !== ReportStatus.COMPLETED}
          >
            <Eye size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(row)}
            disabled={row.status !== ReportStatus.COMPLETED}
          >
            <Download size={16} />
          </Button>
        </div>
      )
    }
  ];

  if (loading && reports.length === 0) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Report History</h2>
          <Button
            variant="outline"
            onClick={fetchReports}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={reports}
        emptyMessage="No reports generated yet"
      />
      
      {pagination.pages > 1 && (
        <div className="p-4 border-t">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
