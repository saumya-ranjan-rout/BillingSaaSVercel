import React, { useState, useEffect } from 'react';
//import Table from '../../common/Table';
import { Table } from '@/components/ui/Table';
import { useApi } from '../../../hooks/useApi';
import { Customer, PaginatedResponse } from '../../../types';
import { toast } from 'sonner';
//import Pagination from '../../common/Pagination';
import { Pagination } from '@/components/ui/Pagination';

interface CustomerListProps {
  onEditCustomer: (customer: Customer) => void;
  refreshTrigger?: number; // new
}

const CustomerList: React.FC<CustomerListProps> = ({ onEditCustomer, refreshTrigger }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // ✅ include del here
  const { get, del } = useApi<PaginatedResponse<Customer>>();

  const fetchCustomers = async () => {
    try {
      const response = await get(
        `/api/customers?page=${pagination.page}&limit=${pagination.limit}`
      );

      console.log(response.data);
      setCustomers(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      toast.error(error?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, pagination.limit, refreshTrigger]);

  // ✅ delete handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await del(`/api/customers/${id}`);
      toast.success('Customer deleted successfully 🗑️');
      fetchCustomers(); // refresh list
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error?.message ||'Failed to delete customer ❌');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (value: string, row: Customer) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {value.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'phone', header: 'Phone' },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, row: Customer) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onEditCustomer(row)}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900 font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={customers}
        // onRowClick={onEditCustomer}
        emptyMessage="No customers found"
      />
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CustomerList;







