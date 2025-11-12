import React, { useState, useEffect, useCallback } from 'react';
// import Table from '../common/Table';
import { Table } from '@/components/ui/Table';
import { useApi } from '../../hooks/useApi';
import { Vendor, PaginatedResponse } from '../../types';
import { toast } from 'sonner';
// import Pagination from '../common/Pagination';
import { Pagination } from '@/components/ui/Pagination';

interface VendorListProps {
  onEditVendor: (vendor: Vendor) => void;
}

const VendorList: React.FC<VendorListProps> = ({ onEditVendor }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { get, del } = useApi<PaginatedResponse<Vendor>>();

  // Reusable fetch function
  const fetchVendors = useCallback(async () => {
    try {
      const response = await get(
        `/api/vendors?page=${pagination.page}&limit=${pagination.limit}`
      );
      setVendors(response.data);
      setPagination(response.pagination);
    } catch ( error: any) {
      console.error('Failed to fetch vendors:', error);
      toast.error(error?.message || 'Failed to load vendors ❌');
    } finally {
      setLoading(false);
    }
  }, [get, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await del(`/api/vendors/${id}`);
      toast.success('Vendor deleted successfully 🗑️');
      fetchVendors();
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error?.message || 'Failed to delete vendor ❌');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    {
      key: 'name',
      header: 'Vendor Name',
      render: (value: string, row: Vendor) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            {value.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 capitalize">
              {row.type?.replace('_', ' ')}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'outstandingBalance',
      header: 'Balance',
      render: (value: number) => (
        <span
          className={
            value > 0 ? 'text-red-600 font-medium' : 'text-green-600'
          }
        >
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Added On',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: Vendor) => (
        <div className="flex gap-3">
          <button
            onClick={() => onEditVendor(row)}
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
      ),
    },
  ];

  if (loading) {
    return <div>Loading vendors...</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={vendors}
        // onRowClick={onEditVendor}
        emptyMessage="No vendors found"
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

export default VendorList;

