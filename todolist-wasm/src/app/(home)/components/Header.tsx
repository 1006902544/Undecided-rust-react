import React, { useEffect } from 'react';
import { MyLogo } from '@/components';
import { useAuthStore } from '@/libs/store';
import { useGetAdminInfo } from '@/libs/api/admin';
import { AuthControl, PageList } from './';
import Link from 'next/link';

export default function Header() {
  const { set_auth, auth_info } = useAuthStore((state) => ({
    set_auth: state.setAuth,
    auth_info: state.authInfo,
  }));

  const { data } = useGetAdminInfo();

  useEffect(() => {
    if (data) {
      set_auth(data.data);
    }
  }, [data]);

  return (
    <header className="w-full h-[60px] flex justify-between items-center px-[60px]">
      <div className="flex items-center">
        <MyLogo width={50} keycode="home" />

        <span className="text-[20px] ml-[10px] mr-[50px]">Welcome</span>

        <PageList />
      </div>

      {auth_info ? (
        <AuthControl auth_info={auth_info} set_auth={set_auth} />
      ) : (
        <Link href="/sign-in">Click to Sign In</Link>
      )}
    </header>
  );
}
