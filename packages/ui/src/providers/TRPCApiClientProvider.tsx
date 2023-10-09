import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { CreateTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@pkg/api';

type TRPCApiClient = CreateTRPCReact<AppRouter, unknown, null>;

const Context = createContext<TRPCApiClient | null>(null);

export function TRPCApiClientProvider(props: {
  apiClient: TRPCApiClient;
  children: ReactNode;
}) {
  const { apiClient, children } = props;
  return <Context.Provider value={apiClient}>{children}</Context.Provider>;
}

export function useApiClient() {
  const apiClient = useContext(Context);
  if (apiClient === null) {
    throw new Error('useApiClient must be within TRPCApiClientProvider');
  }
  return apiClient;
}
