import React, { useState, useEffect, useCallback } from 'react';
// import Table from '../common/Table';
import { Table } from '@/components/ui/Table';
import { useApi } from '../../hooks/useApi';
import { Product, PaginatedResponse, Category } from '../../types';
import { toast } from 'sonner';
// import Pagination from '../common/Pagination';
// import { Badge } from '../common/Badge';
// import Select from '../common/Select';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
// import { Select } from '@/components/ui/Select';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";

interface ProductListProps {
  onEditProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEditProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: '',
    type: '',
    stockStatus: '',
    isActive: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  
  const { get, del } = useApi<PaginatedResponse<Product>>();

  //✅ Fetch products (reusable)
  const fetchProducts = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.type && { type: filters.type }),
        ...(filters.stockStatus && { stockStatus: filters.stockStatus }),
        ...(filters.isActive && { isActive: filters.isActive })
      });

      const response = await get(`/api/products?${queryParams}`);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast.error(error?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [get, pagination.page, pagination.limit, filters]);

   // ✅ Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get('/api/products/categories?limit=100');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [get]);

  // ✅ Fetch products on mount & filter/pagination change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await del(`/api/products/${id}`);
      toast.success('Product deleted successfully 🗑️');
    //  fetchProducts(); // refresh list
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error?.message || 'Failed to delete product ❌');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // const handleFilterChange = (key: string, value: string) => {
  //   setFilters(prev => ({ ...prev, [key]: value }));
  //   setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  // };

  const handleFilterChange = (key: string, value: string) => {
  // Interpret "all" as clearing that filter
  const newValue = value === 'all' ? '' : value;

  setFilters(prev => ({ ...prev, [key]: newValue }));
  setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
};

const getStockStatusBadge = (status: string) => {
  const statusConfig: { [key: string]: { variant: string; label: string } } = {
    in_stock: { variant: 'success', label: 'In Stock' },
    low_stock: { variant: 'warning', label: 'Low Stock' },
    out_of_stock: { variant: 'destructive', label: 'Out of Stock' },
    discontinued: { variant: 'secondary', label: 'Discontinued' },
  };

  const config = statusConfig[status] || { variant: 'secondary', label: status };
  return <Badge variant={config.variant as any}>{config.label}</Badge>;
};


const getTypeBadge = (type: string) => {
  const typeConfig: { [key: string]: { variant: string; label: string } } = {
    goods: { variant: 'info', label: 'Goods' },
    service: { variant: 'primary', label: 'Service' },
    digital: { variant: 'success', label: 'Digital' },
  };

  const config = typeConfig[type] || { variant: 'secondary', label: type };
  return <Badge variant={config.variant as any}>{config.label}</Badge>;
};


  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (value: string, row: Product) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.sku}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (value: any, row: Product) => (
        <span className="text-sm text-gray-600">
          {row.category?.name || 'No Category'}
        </span>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (value: string) => getTypeBadge(value)
    },
    {
      key: 'stockStatus',
      header: 'Stock Status',
      render: (value: string, row: Product) => (
        <div>
          {getStockStatusBadge(value)}
          {row.type === 'goods' && (
            <div className="text-xs text-gray-500 mt-1">
              {row.stockQuantity} {row.unit || 'units'}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'sellingPrice',
      header: 'Price',
      render: (value: number) => `₹${value.toLocaleString()}`
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean) => (
 <Badge variant={value ? 'success' : 'outline'}>
  {value ? 'Active' : 'Inactive'}
</Badge>

      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, row: Product) => (
        <>
          <button
            onClick={() => onEditProduct(row)}
            className="text-blue-600 hover:text-blue-900 font-medium mr-3"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900 font-medium"
          >
            Delete
          </button>
        </>
      )
    }
  ];

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
  {/* Category */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Category
    </label>
    <Select
      value={filters.categoryId || 'all'}
      onValueChange={(value) => handleFilterChange('categoryId', value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Type
    </label>
    <Select
      value={filters.type || 'all'}
      onValueChange={(value) => handleFilterChange('type', value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="goods">Goods</SelectItem>
        <SelectItem value="service">Service</SelectItem>
        <SelectItem value="digital">Digital</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Stock Status */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Stock Status
    </label>
    <Select
      value={filters.stockStatus || 'all'}
      onValueChange={(value) => handleFilterChange('stockStatus', value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="in_stock">In Stock</SelectItem>
        <SelectItem value="low_stock">Low Stock</SelectItem>
        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Active Status */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Active Status
    </label>
    <Select
      value={filters.isActive || 'all'}
      onValueChange={(value) => handleFilterChange('isActive', value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="All Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="true">Active</SelectItem>
        <SelectItem value="false">Inactive</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

      <Table
        columns={columns}
        data={products}
        // onRowClick={onEditProduct}
        emptyMessage="No products found"
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

export default ProductList;

