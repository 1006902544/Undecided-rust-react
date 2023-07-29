import React from 'react';
import { useMenuManagementContext } from '../menuManagement';
import type { PriRoute } from '../menuManagement';
import { Tree, TreeProps } from 'antd';
import { mapToTree } from '@/utils';
import { AssociateModalButton, UpdateModalButton } from '.';
import {
  CloseOutlined,
  FormOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { DeleteButton } from './';

export default function Aside() {
  const { data: res, setSelectedKeys } = useMenuManagementContext() ?? {};

  const onSelect: TreeProps['onSelect'] = (keys, { selected }) => {
    if (selected) {
      setSelectedKeys?.(keys);
    } else {
      setSelectedKeys?.([]);
    }
  };

  const titleRender = (node: PriRoute) => {
    return (
      <div className="flex justify-between">
        <span className="flex-1 truncate">{node.label}</span>
        {node.p_key ? null : (
          <div
            className="flex justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <AssociateModalButton
              rkey={node.key!}
              childNode={
                <OrderedListOutlined className="hover:scale-125 transition-all" />
              }
            />

            <UpdateModalButton
              childNode={
                <FormOutlined className="hover:scale-125 transition-all" />
              }
              record={node}
            />

            <DeleteButton
              routerKey={node.key!}
              childNode={
                <CloseOutlined className="hover:scale-125 transition-all text-[brown]" />
              }
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[300px] h-full flex flex-col">
      <div className="flex-shrink-0 mb-[20px]">
        <UpdateModalButton>Create Root Router</UpdateModalButton>
      </div>
      <Tree
        onSelect={onSelect}
        className="flex-1 w-[300px]"
        treeData={mapToTree({
          data: (res?.data as any) ?? [],
          fieldProps: {
            pkey: 'p_key',
          },
        })}
        fieldNames={{
          title: 'label',
        }}
        titleRender={titleRender as any}
      />
    </div>
  );
}