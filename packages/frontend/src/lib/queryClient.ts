import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { offlineManager } from './offline/OfflineManager';

const STALE_TIMES = {
  default: 1000 * 60 * 5, // 5 minutes
  invoices: 1000 * 60 * 2,
  customers: 1000 * 60 * 10,
  products: 1000 * 60 * 30,
};

const RETRY_CONFIG = {
  retry: (failureCount: number, error: any) => {
    if (error?.status === 404 || error?.status === 401) return false;
    return failureCount < 3;
  },
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};

const customQueryFn: QueryFunction = async ({ queryKey, signal }) => {
  const [resource, id] = queryKey as [string, string?];
  try {
    const response = await fetch(`/api/${resource}${id ? `/${id}` : ''}`, { signal });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    // Offline fallback
    if (!offlineManager.onlineStatus) {
      const offlineData = await offlineManager.getFromCache(resource, id);
      if (offlineData) return offlineData;
    }
    throw error;
  }
};

// ✅ Updated here
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: customQueryFn,
      staleTime: STALE_TIMES.default,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours instead of cacheTime
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      ...RETRY_CONFIG,
    },
  },
});

queryClient.setMutationDefaults(['invoices'], {
  onMutate: async (variables: Record<string, any>) => {
    await queryClient.cancelQueries({ queryKey: ['invoices'] });

    // previous data (explicitly typed)
    const previousInvoices = queryClient.getQueryData<Record<string, any>[]>(['invoices']);

    // ✅ explicitly type old value to avoid void/object inference errors
    queryClient.setQueryData<Record<string, any>[]>(['invoices'], (old = []) => {
      const invoices = Array.isArray(old) ? old : [];
      return [...invoices, { ...variables, _optimistic: true }];
    });

    return { previousInvoices };
  },

  onError: (error, variables, context: { previousInvoices?: Record<string, any>[] } | undefined) => {
    if (context?.previousInvoices) {
      queryClient.setQueryData(['invoices'], context.previousInvoices);
    }

    // ✅ explicitly type payload to ensure it’s accepted
offlineManager.enqueueAction({
      type: 'CREATE_INVOICE',
      payload: variables as Record<string, any>,
      timestamp: Date.now(),
      retries: 0,
    });
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
  },

  ...RETRY_CONFIG,
});
