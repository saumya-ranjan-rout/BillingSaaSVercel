import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../../hooks/useApi';
import { Invoice, PaginatedResponse, Customer } from '../../../types';
import { toast } from 'sonner';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InvoiceListProps {
  onEditInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
   refreshKey: number; // ✅ added prop
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onEditInvoice, onViewInvoice, refreshKey }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    customerId: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { get, del, getBlob } = useApi<PaginatedResponse<Invoice>>();

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.customerId && { customerId: filters.customerId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await get(`/api/invoices?${queryParams}`);
      setInvoices(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Failed to fetch invoices:', error);
      toast.error(error?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [get, pagination.page, pagination.limit, filters]);

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response: { data: any[] } = await get('/api/customers?limit=100');
      console.log(response);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  fetchCustomers();
}, [get]);


  // useEffect(() => {
  //   fetchInvoices();
  // }, [fetchInvoices]);

    // ✅ now re-fetches whenever refreshKey changes
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice order?')) return;

    try {
      await del(`/api/invoices/${id}`);
      toast.success('Invoice deleted successfully 🗑️');
      fetchInvoices();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete invoice ❌');
    }
  };

  const handlePrint = async (id: string) => {
    try {
      const blob = await getBlob(`/api/invoices/${id}/pdf`);
      if (blob.type !== 'application/pdf') throw new Error('Invalid PDF response');

      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (!newWindow) toast.error('Popup blocked! Please allow popups to view PDF.');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to generate invoice PDF ❌');
    }
  };

const handleFilterChange = (key: string, value: string) => {
  const finalValue = value === 'all' ? '' : value;
  setFilters(prev => ({ ...prev, [key]: finalValue }));
  setPagination(prev => ({ ...prev, page: 1 }));
};

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      draft: { label: 'Draft', variant: 'outline' },
      sent: { label: 'Sent', variant: 'default' },
      viewed: { label: 'Viewed', variant: 'warning' },
      partial: { label: 'Partial', variant: 'warning' },
      paid: { label: 'Paid', variant: 'success' },
      overdue: { label: 'Overdue', variant: 'danger' },
      cancelled: { label: 'Cancelled', variant: 'outline' },
    };
    const { label, variant } = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: any }> = {
      standard: { label: 'Standard', variant: 'default' },
      proforma: { label: 'Proforma', variant: 'warning' },
      credit: { label: 'Credit', variant: 'success' },
      debit: { label: 'Debit', variant: 'danger' },
    };
    const { label, variant } = typeMap[type] || { label: type, variant: 'outline' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: (value: string, row: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.customer?.name}</div>
        </div>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: string) => getTypeBadge(value),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      key: 'balanceDue',
      header: 'Balance Due',
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, row: Invoice) => (
        <div className="flex space-x-2">
          {/* <Button onClick={() => onViewInvoice(row)} variant="outline" size="sm">
            View
          </Button> */}
          <Button onClick={() => handlePrint(row.id)} variant="outline" size="sm">
            Print
          </Button>
          {row.status === 'draft' && (
            <>
              <Button onClick={() => onEditInvoice(row)} variant="outline" size="sm">
                Edit
              </Button>
              <Button onClick={() => handleDelete(row.id)} variant="danger" size="sm">
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading invoices...</div>;

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Customer */}
        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <Select
            onValueChange={(val) => handleFilterChange('customerId', val)}
            value={filters.customerId}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
             <SelectItem value="all">All Customers</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            onValueChange={(val) => handleFilterChange('status', val)}
            value={filters.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select
            onValueChange={(val) => handleFilterChange('type', val)}
            value={filters.type}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="proforma">Proforma</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date filters */}
        <Input
          label="From Date"
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />
        <Input
          label="To Date"
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={invoices}
        onRowClick={onViewInvoice}
        emptyMessage="No invoices found"
      />

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      )}
    </div>
  );
};

export default InvoiceList;
