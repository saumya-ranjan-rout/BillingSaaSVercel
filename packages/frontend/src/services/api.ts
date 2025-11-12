import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store/store'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_BASE_URL || 'http://192.168.29.17:3001/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  // ✅ Added missing tag types used by billingApi
  tagTypes: [
    'User',
    'Invoice',
    'Customer',
    'Product',
    'Subscription',      // ← add this
    'PaymentMethods'     // ← and this
  ],
  endpoints: () => ({}),
})
