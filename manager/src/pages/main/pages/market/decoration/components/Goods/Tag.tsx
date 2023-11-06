import { useGetTagsList } from '@/libs/api';
import { Spin } from 'antd';
import React, { type MouseEventHandler, useCallback } from 'react';
import { useGoodsContext } from './Goods';

export default function Tag() {
  const { data, isLoading } = useGetTagsList();
  const { setParams, tag } = useGoodsContext();

  const onClick: MouseEventHandler<HTMLLIElement> = useCallback(
    (e) => {
      const tag = e.currentTarget?.dataset.value;

      setParams?.((state) => ({
        ...state,
        tag: tag ? Number(tag) : undefined,
      }));
    },
    [setParams]
  );

  return (
    <div className="w-[100px] flex-shrink-0 min-h-[500px] border-[1px] border-[#e6e6e6] rounded-md">
      <h2 className="bg-[#e6e6e6] p-[5px] text-center">Tags</h2>

      <ul className="px-[10px]">
        <Spin spinning={isLoading}>
          <li
            className="indent-4 mt-3 border-b-[2px] cursor-pointer"
            style={{
              borderColor: !tag ? '#e6e6e6' : 'rgba(0,0,0,0)',
            }}
            onClick={onClick}
          >
            All
          </li>

          {data?.data.map((item) => {
            return (
              <li
                className="indent-4 mt-3 border-b-[2px] cursor-pointer"
                key={item.value}
                data-value={item.value}
                onClick={onClick}
                style={{
                  borderColor:
                    item.value === tag?.toString()
                      ? '#e6e6e6'
                      : 'rgba(0,0,0,0)',
                }}
              >
                {item.label}
              </li>
            );
          })}
        </Spin>
      </ul>
    </div>
  );
}
