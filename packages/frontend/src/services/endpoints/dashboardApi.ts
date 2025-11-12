import { api } from '../api';
import { DashboardStats, ChartData } from '../../types';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
    }),
    getRevenueChartData: builder.query<ChartData, { period: 'week' | 'month' | 'year' }>({
      query: (params) => `/dashboard/revenue?period=${params.period}`,
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueChartDataQuery,
} = dashboardApi;
