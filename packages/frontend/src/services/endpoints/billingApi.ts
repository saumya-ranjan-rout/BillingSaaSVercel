import { api } from '../api';

export const billingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query<any, void>({
      query: () => '/billing/subscription',
      providesTags: ['Subscription'],
    }),
    updateSubscription: builder.mutation<any, { plan: string }>({
      query: (data) => ({
        url: '/billing/subscription',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    getPaymentMethods: builder.query<any, void>({
      query: () => '/billing/payment-methods',
      providesTags: ['PaymentMethods'],
    }),
    addPaymentMethod: builder.mutation<any, any>({
      query: (data) => ({
        url: '/billing/payment-methods',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentMethods'],
    }),
    removePaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/billing/payment-methods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentMethods'],
    }),
    setDefaultPaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/billing/payment-methods/${id}/default`,
        method: 'POST',
      }),
      invalidatesTags: ['PaymentMethods'],
    }),
    getBillingHistory: builder.query<any, void>({
      query: () => '/billing/history',
    }),
    downloadInvoice: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/billing/invoices/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useRemovePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetBillingHistoryQuery,
  useDownloadInvoiceMutation,
} = billingApi;
