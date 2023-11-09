'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { Header } from '.';
import { message } from '@/lib/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <div className="w-[100vw] h-[100vh] flex flex-col bg-[#313338]">
          <Header />

          <div className="flex-1"> {children}</div>
        </div>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
