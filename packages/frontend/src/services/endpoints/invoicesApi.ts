import { api } from '../api';
import { Invoice } from '../../types';

export const invoicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<
      { data: Invoice[]; total: number; page: number; limit: number },
      { page: number; limit: number; status?: string; customer?: string; startDate?: string; endDate?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.customer) queryParams.append('customer', params.customer);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        // alert(queryParams.toString());
        return {
          url: `/invoices?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query<Invoice, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    createInvoice: builder.mutation<Invoice, Partial<Invoice>>({
      query: (invoice) => ({
        url: '/invoices',
        method: 'POST',
        body: invoice,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoice: builder.mutation<Invoice, { id: string; data: Partial<Invoice> }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }],
    }),
    deleteInvoice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice'],
    }),
    sendInvoice: builder.mutation<void, { id: string; email?: string }>({
      query: ({ id, email }) => ({
        url: `/invoices/${id}/send`,
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }],
    }),
    markAsPaid: builder.mutation<Invoice, string>({
      query: (id) => ({
        url: `/invoices/${id}/pay`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useMarkAsPaidMutation,
} = invoicesApi;
