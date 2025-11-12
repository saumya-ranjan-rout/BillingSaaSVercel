import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();
export const offlineManager = onlineManager;

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
