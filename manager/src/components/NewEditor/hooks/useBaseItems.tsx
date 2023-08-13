import { useMemo } from 'react';
import { ToolbarItem } from '../index.d';

export const useBaseItems = () => {
  const baseItems: ToolbarItem[] = [
    {
      key: 'bold',
      children: <span className="px-[8px] font-bold">B</span>,
    },
  ];

  // eslint-disable-next-line
  return useMemo(() => baseItems, []);
};
