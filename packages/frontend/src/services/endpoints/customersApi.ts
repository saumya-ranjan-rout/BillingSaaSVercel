import { api } from '../api';
import { Customer } from '../../types';

export const customersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<
      { data: Customer[]; total: number; page: number; limit: number },
      { page: number; limit: number; search?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        alert(queryParams.toString());
        return {
          url: `/customers?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<Customer, { id: string; data: Partial<Customer> }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
