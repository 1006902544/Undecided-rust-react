import React, { type MouseEventHandler, useMemo, useCallback } from 'react';
import { useGoodsContext } from './Goods';
import type { SpuLimitSort } from '@/libs/api/schema';

export default function SortContainer() {
  const { setParams, sortBy } = useGoodsContext();

  const sortOption = useMemo<{ label: string; value: SpuLimitSort }[]>(
    () => [
      {
        label: 'Newest',
        value: 'time',
      },
      {
        label: 'Most likely',
        value: 'most_likely',
      },
      {
        label: 'Most attention',
        value: 'most_attention',
      },
    ],
    []
  );

  const handleSortBy: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const value = e.currentTarget.dataset.value;
      if (value) {
        setParams?.((state) => ({
          ...state,
          sortBy: value as SpuLimitSort,
        }));
      }
    },
    [setParams]
  );

  return (
    <div className="p-[10px] flex justify-center">
      <div className="py-[10px] px-[40px] space-x-6">
        {sortOption.map(({ value, label }) => (
          <button
            key={value}
            data-value={value}
            onClick={handleSortBy}
            className="px-[10px] rounded-[4px] border-[1px] border-[gray] transition-all"
            style={{
              backgroundColor: sortBy === value ? '#e6e6e6' : undefined,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
