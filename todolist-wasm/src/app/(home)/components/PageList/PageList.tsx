'use client';
import { Popover } from '@/components';
import React, { useMemo } from 'react';
import './PageList.scss';
import { usePathname, useRouter } from 'next/navigation';

export default function PageList() {
  const pathname = usePathname();
  const router = useRouter();

  const route_list = useMemo(
    () => [
      {
        pathname: '/home',
        active: pathname === '/home',
        name: 'Home',
      },
      {
        pathname: '/shop',
        active: pathname === '/shop',
        name: 'Shop',
      },
    ],
    [pathname]
  );

  const to_path = (pathname: string) => {
    router.push(pathname);
  };

  return (
    <Popover
      type="click"
      content={
        <div className="menu-container">
          <span className="px-[20px] border-b-[1px] border-[#ccc]">Menu</span>
          <ul className="mt-[10px] flex h-[60px] space-x-[10px]">
            {route_list.map(({ pathname, active, name }) => (
              <li key={pathname} onClick={() => to_path(pathname)}>
                <div
                  className={`li-content ${
                    active ? 'list-content-active' : ''
                  }`}
                >
                  {name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <button className="">CheckMenu</button>
    </Popover>
  );
}
