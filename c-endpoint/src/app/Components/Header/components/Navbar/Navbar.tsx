'use client';
import React, {
  MouseEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import NavbarButton from './NavbarButton';

interface Navbar {
  value: string;
  label: string;
  active: boolean;
}

export default function Navbar() {
  const [option, setOption] = useState<Navbar[]>([
    {
      label: 'Market',
      value: '/market',
      active: true,
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
  ]);

  const moveTo: MouseEventHandler = useCallback((e) => {
    const link = (e.currentTarget as any).dataset.value;
    setOption((pre) =>
      pre.map((item) => ({
        ...item,
        active: item.value === link,
      }))
    );
  }, []);

  const activityIndex = useMemo(
    () => option.findIndex((item) => item.active),
    [option]
  );

  const blockStyle = useMemo(() => {
    const per = (1 / option.length) * 100;
    return {
      width: `${per.toFixed(2)}%`,
      bottom: 0,
      left: `${(activityIndex * per).toFixed(2)}%`,
    };
  }, [activityIndex, option.length]);

  return (
    <div className="relative flex">
      {option.map((item) => (
        <div
          key={item.value}
          data-value={item.value}
          onClick={moveTo}
          className="w-[200px] flex justify-center items-center"
        >
          <NavbarButton disabled={item.active}>{item.label}</NavbarButton>
        </div>
      ))}

      <i
        className="absolute h-[3px] transition-all bg-[#4669dd] rounded-sm"
        style={blockStyle}
      />
    </div>
  );
}
