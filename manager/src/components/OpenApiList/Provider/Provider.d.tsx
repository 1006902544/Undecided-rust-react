export interface OpenApiProviderContext {
  data?: Record<string, string>;
  isLoading: boolean;
}

export interface OpenApiProviderProps {
  children?: React.ReactNode;
  getOpenApi: () => Promise<{
    data: Record<string, string>;
  }>;
}
