import { api } from '../api';
import { User, Tenant, ApiError } from '../../types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      // { user: User; token: string; tenants: Tenant[] }, 
      // { email: string; password: string }
        { user: any; accessToken: string; refreshToken: string }, // response type
      { email: string; password: string; }    // request type  tenantId: string 
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

      superUserLogin: builder.mutation<
      { user: any; accessToken: string; refreshToken: string },
      { tenant: string; email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/super-user-login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
   register: builder.mutation<
  { user: User; token: string; tenant: Tenant },
  { 
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    businessName: string;
     subdomain?: string;
    accountType?: string;
    professionType?: string;
    licenseNo?: string;
    pan?: string;
    gst?: string;
  }
>({
  query: (userData) => ({
    url: '/auth/register',
    method: 'POST',
    body: userData,
  }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: email,
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
    useSuperUserLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} = authApi;
