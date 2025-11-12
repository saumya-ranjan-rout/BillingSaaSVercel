import React, { useState, useEffect } from "react";
// import Table from "../common/Table";
// import Pagination from "../common/Pagination";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { useApi } from "../../hooks/useApi";
import { toast } from "sonner";
import { User } from "../../types";

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   status: string;
//   createdAt: string;
// }

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UserListProps {
  onEditUser: (user: User) => void;
  refreshTrigger?: number;
}

const UserList: React.FC<UserListProps> = ({ onEditUser, refreshTrigger }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { get, del } = useApi<PaginatedResponse<User>>();

  const fetchUsers = async () => {
    try {
      const response = await get(
        `/api/users?page=${pagination.page}&limit=${pagination.limit}`
      );
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast.error(error?.message || "Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await del(`/api/users/${id}`);
      toast.success("User deleted successfully 🗑️");
      fetchUsers();
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error( error?.message || "Failed to delete user ❌");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    {
      key: "firstName",
      header: "Name",
      render: (value: string, row: User) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {value?.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (value: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
          {value.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => {
        const color =
          value === "active"
            ? "bg-green-100 text-green-800"
            : value === "invited"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800";
        return (
          <span className={`px-2 py-1 text-xs rounded ${color}`}>
            {value.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (value: any, row: User) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onEditUser(row)}
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

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <Table columns={columns} data={users} emptyMessage="No users found" />
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

export default UserList;
