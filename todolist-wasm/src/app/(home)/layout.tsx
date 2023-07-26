'use client';
import React from 'react';
import { Header, Footer } from './components';
import './layout.scss';
import { MyLogo } from '@/components';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <section className="flex-grow overflow-y-scroll overflow-x-hidden p-[20px] flex relative">
        <MyLogo
          keycode="home-bg"
          width={1000}
          className="absolute opacity-[0.1] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[-1]"
        />
        {children}
      </section>

      <Footer />
    </div>
  );
}
