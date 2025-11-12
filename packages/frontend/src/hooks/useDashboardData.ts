import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';

export const useDashboardData = () => {
  const { get } = useApi();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await get('/api/dashboard');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
  });
};;

// Lazy loading components
// billingSoftware-SaaS/packages/frontend/src/components/LazyComponents.tsx

import { lazy } from 'react';

// export const LazyChart = lazy(() => import('../components/charts/ChartComponent'));
export const LazyReportViewer = lazy(() => import('../components/reports/ReportViewer'));
// export const LazyDataGrid = lazy(() => import('../components/common/DataGrid'));
