'use client';
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Navbar {
  value: string;
  label: string;
  active: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [option, setOption] = useState<Navbar[]>([
    {
      label: 'Market',
      value: '/market',
      active: false,
    },
    {
      label: 'Storehouse',
      value: '/storehouse',
      active: false,
    },
    {
      label: 'Community',
      value: '/community',
      active: false,
    },
    {
      label: 'Mine',
      value: '/mine',
      active: false,
    },
  ]);

  useEffect(() => {
    setOption((option) =>
      option.map((item) => ({
        ...item,
        active: item.value === pathname,
      }))
    );
  }, [pathname]);

  const push = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  return (
    <div className="flex space-x-6 ml-52">
      {option.map((item) => (
        <button
          className="border-[#a54141] leading-7 px-[10px]"
          style={{
            borderBottomWidth: item.active ? 1 : 0,
          }}
          key={item.value}
          onClick={() => push(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
