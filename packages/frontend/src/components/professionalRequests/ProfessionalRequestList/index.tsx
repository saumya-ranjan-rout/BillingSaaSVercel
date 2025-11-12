import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";

interface ProfessionalRequest {
  id: string;
  name: string;
  email: string;
  status: string;
  requestedBy: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  requestedTo: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
  metadata?: any;
}

const ProfessionalRequestList: React.FC = () => {
  const [requests, setRequests] = useState<ProfessionalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { get, patch } = useApi<any>();

  // ✅ Fetch requests
  const fetchRequests = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
      });

      const res = await get(`/api/professional-requests?${queryParams}`);
      console.log("res", res);
      setRequests(res || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(error?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [get, pagination.page, pagination.limit, filters.status]);

  // useEffect(() => {
  //   fetchRequests();
  // }, [fetchRequests]);

  useEffect(() => {
  fetchRequests();
}, [filters.status, pagination.page, pagination.limit]);

  // ✅ Update status (Approve/Reject)
  const updateStatus = async (id: string, status: string) => {
    try {
      await patch(`/api/professional-requests/${id}/status`, { status });
      toast.success(`Request ${status} successfully ✅`);
      fetchRequests();
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.message || "Failed to update status ❌");
    }
  };

  // ✅ Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const newValue = value === "all" ? "" : value;
    alert(newValue);
    setFilters((prev) => ({ ...prev, [key]: newValue }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ✅ Badge component for status
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: string; label: string }> = {
      Pending: { variant: "warning", label: "Pending" },
      Approved: { variant: "success", label: "Approved" },
      Rejected: { variant: "destructive", label: "Rejected" },
    };

    const badge = config[status] || { variant: "secondary", label: status };
    return <Badge variant={badge.variant as any}>{badge.label}</Badge>;
  };

  // ✅ Table columns
  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (value: string, row: ProfessionalRequest) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
{
  key: "requestedBy",
  header: "Requested By",
  render: (value: string, row: ProfessionalRequest) => (
    <div>
      <div className="font-medium text-gray-900">
        {row.requestedBy?.firstName} {row.requestedBy?.lastName}
      </div>
      <div className="text-sm text-gray-500">{row.requestedBy?.role}</div>
    </div>
  ),
},
{
  key: "requestedTo",
  header: "Requested To",
  render: (value: string, row: ProfessionalRequest) => (
    <div>
      <div className="font-medium text-gray-900">
        {row.requestedTo?.firstName} {row.requestedTo?.lastName}
      </div>
      <div className="text-sm text-gray-500">{row.requestedTo?.role}</div>
    </div>
  ),
},
    {
      key: "status",
      header: "Status",
      render: (value: string) => getStatusBadge(value || "Pending"),
    },
   {
  key: "actions",
  header: "Actions",
  render: (value: any, row: ProfessionalRequest) => {
    // Check if the status is "Rejected"
    if (row.status === "Rejected") {
      return null; // Hide the buttons if status is "Rejected"
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateStatus(row.id, "Approved")}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Approve
        </button>
        <button
          onClick={() => updateStatus(row.id, "Rejected")}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    );
  },
},
  ];

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div>
      {/* ✅ Filters */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
             
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* ✅ Table */}
      <Table
        columns={columns}
        data={requests.filter((req) => req.name)} // remove empty data
        emptyMessage="No requests found"
      />

      {/* ✅ Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, page }))
          }
        />
      )}
    </div>
  );
};

export default ProfessionalRequestList;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useApi } from '../../../hooks/useApi';


// const ProfessionalRequestList = () => {
//   const [requests, setRequests] = useState<any[]>([]);
//    const { get, del, patch } = useApi<any>();

//   const fetchRequests = async () => {
//     const res = await get("/api/professional-requests");
//     console.log("res", res);
//       setRequests(res || []); // ✅ changed
//   };

//   const updateStatus = async (id: string, status: string) => {
//     await patch(`/api/professional-requests/${id}/status`, { status });
//     fetchRequests();
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   return (
//     <table className="w-full border mt-6">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="p-2">Customer Name</th>
//           <th className="p-2">Professional</th>
//           <th className="p-2">Status</th>
//           <th className="p-2">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {requests.map((req) => (
//           <tr key={req.id}>
//             <td className="p-2">{req.name}</td>
//             <td className="p-2">{req.metadata?.professionalUserId}</td>
//             <td className="p-2">{req.metadata_status || "Pending"}</td>
//             <td className="p-2">
//               <button
//                 onClick={() => updateStatus(req.id, "Approved")}
//                 className="bg-green-500 text-white px-3 py-1 rounded mr-2"
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => updateStatus(req.id, "Rejected")}
//                 className="bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Reject
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default ProfessionalRequestList;
