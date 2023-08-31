import { useQuery } from '@tanstack/react-query';
import React, { createContext, useCallback } from 'react';
import type {
  OpenApiProviderContext,
  OpenApiProviderProps,
} from './Provider.d';

const OpenApiListContext = createContext<OpenApiProviderContext>({
  isLoading: true,
});

export default function Provider({
  children,
  getOpenApi: getOpenApiProp,
}: OpenApiProviderProps) {
  const getOpenApi = useCallback(async () => {
    return await getOpenApiProp();
  }, [getOpenApiProp]);

  const { data, isLoading } = useQuery<unknown, any, Record<string, string>>({
    queryFn: getOpenApi,
    queryKey: ['getOpenApiForList'],
  });

  return (
    <OpenApiListContext.Provider
      value={{
        data,
        isLoading,
      }}
    >
      {children}
    </OpenApiListContext.Provider>
  );
}
