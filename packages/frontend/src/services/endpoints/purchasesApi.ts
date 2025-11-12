// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  PurchaseOrder,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  PurchaseOrderStatus,
} from '../../types';

export const purchasesApi = createApi({
  reducerPath: 'purchasesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // 👈 adjust this baseUrl if needed
  tagTypes: ['PurchaseOrder'],
  endpoints: (builder) => ({
    // ✅ Get all purchase orders
    getPurchaseOrders: builder.query<
      { data: PurchaseOrder[]; total: number; page: number; totalPages: number },
      {
        status?: PurchaseOrderStatus;
        vendorId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: (params) => ({
        url: '/purchases/orders',
        params,
      }),
      providesTags: ['PurchaseOrder'],
    }),

    // ✅ Get a single purchase order by ID
    getPurchaseOrderById: builder.query<PurchaseOrder, string>({
      query: (id) => `/purchases/orders/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'PurchaseOrder', id }],
    }),

    // ✅ Create a purchase order
    createPurchaseOrder: builder.mutation<PurchaseOrder, CreatePurchaseOrderRequest>({
      query: (body) => ({
        url: '/purchases/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),

    // ✅ Update a purchase order
    updatePurchaseOrder: builder.mutation<PurchaseOrder, { id: string; data: UpdatePurchaseOrderRequest }>({
      query: ({ id, data }) => ({
        url: `/purchases/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'PurchaseOrder', id }],
    }),

    // ✅ Delete a purchase order
    deletePurchaseOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/purchases/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PurchaseOrder'],
    }),

    // ✅ Update purchase order status
    updatePurchaseOrderStatus: builder.mutation<PurchaseOrder, { id: string; status: PurchaseOrderStatus }>({
      query: ({ id, status }) => ({
        url: `/purchases/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'PurchaseOrder', id }],
    }),

    // ✅ Receive items
    receivePurchaseOrderItems: builder.mutation<
      PurchaseOrder,
      { id: string; receivedItems: Array<{ itemId: string; receivedQuantity: number; condition?: string; notes?: string }> }
    >({
      query: ({ id, receivedItems }) => ({
        url: `/purchases/orders/${id}/receive`,
        method: 'POST',
        body: { receivedItems },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'PurchaseOrder', id }],
    }),

    // ✅ Get purchase orders by vendor
    getPurchaseOrdersByVendor: builder.query<PurchaseOrder[], { vendorId: string; status?: PurchaseOrderStatus; startDate?: string; endDate?: string }>({
      query: ({ vendorId, ...params }) => ({
        url: `/purchases/vendors/${vendorId}/orders`,
        params,
      }),
      providesTags: ['PurchaseOrder'],
    }),

    // ✅ Get statistics
    getPurchaseStatistics: builder.query<
      {
        totalOrders: number;
        totalAmount: number;
        pendingOrders: number;
        completedOrders: number;
        averageOrderValue: number;
        byStatus: Record<PurchaseOrderStatus, number>;
        byVendor: Array<{ vendorId: string; vendorName: string; totalOrders: number; totalAmount: number }>;
      },
      { startDate?: string; endDate?: string; vendorId?: string }
    >({
      query: (params) => ({
        url: '/purchases/statistics',
        params,
      }),
    }),

    // ✅ Export purchase orders
    exportPurchaseOrders: builder.mutation<Blob, { status?: PurchaseOrderStatus; vendorId?: string; startDate?: string; endDate?: string; format?: 'csv' | 'excel' | 'pdf' }>({
      query: (params) => ({
        url: '/purchases/export',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // ✅ Upload attachment
    uploadAttachment: builder.mutation<{ url: string; filename: string }, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/purchases/orders/${id}/attachments`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [{ type: 'PurchaseOrder', id }],
    }),

    // ✅ Delete attachment
    deleteAttachment: builder.mutation<void, { id: string; attachmentId: string }>({
      query: ({ id, attachmentId }) => ({
        url: `/purchases/orders/${id}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'PurchaseOrder', id }],
    }),

    // ✅ Get audit log
    getAuditLog: builder.query<
      Array<{
        id: string;
        action: string;
        description: string;
        userId: string;
        userName: string;
        timestamp: string;
        changes?: Record<string, { old: any; new: any }>;
      }>,
      string
    >({
      query: (id) => `/purchases/orders/${id}/audit-log`,
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useUpdatePurchaseOrderStatusMutation,
  useReceivePurchaseOrderItemsMutation,
  useGetPurchaseOrdersByVendorQuery,
  useGetPurchaseStatisticsQuery,
  useExportPurchaseOrdersMutation,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetAuditLogQuery,
} = purchasesApi;

export default purchasesApi;
