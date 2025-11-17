import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
//import Table from '../../common/Table';
import { Table } from '@/components/ui/Table';
import { useApi } from '../../../hooks/useApi';
import { Customer, PaginatedResponse } from '../../../types';
import { toast } from 'sonner';
//import Pagination from '../../common/Pagination';
import { Pagination } from '@/components/ui/Pagination';
// import { authService } from '@/lib/auth';
import { setCredentials, setError, selectAuthError } from "../../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
interface CustomerListProps {
  onEditCustomer: (customer: Customer) => void;
  refreshTrigger?: number; // new
}
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}
const CustomerList: React.FC<CustomerListProps> = ({ onEditCustomer, refreshTrigger }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<User | null>(null);
     const dispatch = useAppDispatch();
     const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // ✅ include del here
  const { get, del } = useApi<PaginatedResponse<Customer>>();
  const { get: gett } = useApi<any>();
  const { put } = useApi<any>();

  const fetchCustomers = async () => {
    try {
      const response = await get(
        `/api/customers?page=${pagination.page}&limit=${pagination.limit}`
      );

     // console.log(response.data);
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
    const fetchUser = async () => {
      try {
        const res = await gett("/api/auth/me");
       // console.log("user", res);
        setUser(res.user);

      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

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
// const handleViewBusiness = async (tenantId: string | null) => {
// alert(tenantId);
//       if (!tenantId) {
//         toast.error("Invalid tenant selected");
//         return;
//       }
//       try {
//         const response = await put('/api/customers/switch-tenant', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ tenantId }),
//         });
  
//         const data = await response.json();
//   console.log("jiku",data);
//         if (response.ok) {
//           // Set tokens first
//           authService.setTokens(data.token, data.refreshToken);
          
//           // Set user context
//           setUser(data.user);
          
//           // Force a hard navigation to dashboard to avoid stale state
//           window.location.href = '/app/dashboard';
//         } else {
//           authService.clearTokens();
//         }
//       } catch (error) {
//         console.error('Login error:', error);
//         authService.clearTokens();
//       } finally {
//       }
//     };


     const viewBusiness = async (id: string, role: string) => {

    if (!confirm('Are you sure you want to switch tenant?')) return;



    try {

      const response = await gett(`/api/customers/switchTenant/${id}/${role}`);

     // console.log("jiku",response);

       dispatch(setCredentials({ user: response.user, token: response.accessToken }));

            localStorage.setItem("token", response.accessToken);

            localStorage.setItem("user", JSON.stringify(response.user));

      toast.success('Tenant switched successfully 🗑️');

     router.replace("/app/dashboard");

    } catch (error: any) {

      console.error('Tenant switching failed:', error);

      toast.error(error?.message ||'Failed to switch tenant ❌');

    }

  };
// const handleViewBusiness = async (tenantId: string | null) => {
//   alert(tenantId);
//   if (!tenantId) {
//     toast.error("Invalid tenant selected");
//     return;
//   }

//   try {
//     const data = await put(
//       `/api/customers/switch-tenant/${tenantId}`,
//       {}  // Important fix
//     );
//     localStorage.setItem("token", data.token);

// console.log(data);
//     if (data) {
//       toast.success(data.message);
//       window.location.href = "/app/dashboard";
//     } else {
//       toast.error(data.message);
//     }

//   } catch (error: any) {
//     console.error("Failed to switch tenant:", error);
//     toast.error(error?.message || "Failed to load customers");
//   }
// };




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
  render: (value: any, row: Customer) => {

    let tenantIdToCheck = null;

    // requestedBy admin/user (not professional)
    if (row.requestedBy && row.requestedBy.role !== "professional") {
      tenantIdToCheck = row.requestedBy.tenantId ?? null;
    }

    // requestedTo admin/user (not professional)
    if (row.requestedTo && row.requestedTo.role !== "professional") {
      tenantIdToCheck = row.requestedTo.tenantId ?? null;
    }

    return (
      <div className="flex space-x-3">
        <button
          onClick={() => onEditCustomer(row)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(row.id)}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Delete 
          {/* {user?.role} */}
        </button>

        {/* ONLY SHOW FOR PROFESSIONAL */}
        {user?.role === "professional" &&
          row?.checkSubscription === "active" &&
          tenantIdToCheck && ( // ensure we have tenantId
            // <button
            //   onClick={() => handleViewBusiness(tenantIdToCheck)}
            //   className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            // >
            //   View Business
            // </button>

             <button onClick={() => viewBusiness(tenantIdToCheck,"professional_user")} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"> View Business </button>
          )}
      </div>
    );
  }
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







