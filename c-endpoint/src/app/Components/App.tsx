'use client';
import { NextUIProvider } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { Header } from '.';
import { message } from '@/lib/components';

export default function App({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    message.success('casc');
  }, []);

  return (
    <NextUIProvider>
      <div className="w-[100vw] h-[100vh] flex flex-col bg-[#313338]">
        <Header />

        <div className="flex-1"> {children}</div>
      </div>
    </NextUIProvider>
  );
}
