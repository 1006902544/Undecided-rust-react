import React, { useState } from 'react';
import { PriRoute } from '../menuManagement';
import { useGetAllRouter } from '@/libs/api';
import { Tree, TreeProps } from 'antd';
import { mapToTree } from '@/utils';

interface IProps {
  setDataSource: React.Dispatch<React.SetStateAction<PriRoute[]>>;
}

export default function Aside({ setDataSource }: IProps) {
  const { data: res } = useGetAllRouter({
    query: {},
  });

  const onSelect: TreeProps['onSelect'] = (_, { node, selected }) => {
    if (selected) {
      setDataSource((node.children as any) ?? []);
    } else {
      setDataSource([]);
    }
  };

  return (
    <div className="w-[300px] h-full">
      <Tree
        onSelect={onSelect}
        className="h-full w-[300px]"
        treeData={mapToTree({
          data: (res?.data as any) ?? [],
          fieldProps: {
            pkey: 'p_key',
          },
        })}
        fieldNames={{
          title: 'label',
        }}
      />
    </div>
  );
}
