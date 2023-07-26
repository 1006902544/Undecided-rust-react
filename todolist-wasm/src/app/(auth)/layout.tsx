'use client';
import Link from 'next/link';
import './auth.scss';
import { ColorfulBg, MyLogo } from '@/components';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 flex relative justify-center items-center">
      <Link href="/home" className=" fixed right-[20px] top-[20px]">
        Home Page
      </Link>

      <MyLogo width={400} keycode="auth" className="mr-[200px]" />

      <div>
        <ColorfulBg thickness={5} className=" rounded-[3px]">
          <div className=" rounded-[3px] w-[450px] p-[20px] min-h-0 transition-all bg-[white]">
            {children}
          </div>
        </ColorfulBg>
      </div>
    </div>
  );
};

export default Layout;
