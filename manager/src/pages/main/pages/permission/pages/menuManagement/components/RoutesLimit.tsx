import React from 'react';
import { useMenuManagementContext, type PriRoute } from '../menuManagement';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DeleteButton, UpdateModalButton } from './';

export default function RoutesLimit() {
  const { selectedNode } = useMenuManagementContext() ?? {};

  const columns: ColumnsType<PriRoute> = [
    { dataIndex: 'key', title: 'KEY', width: 60, align: 'center' },
    { dataIndex: 'label', title: 'LABEL', width: 180, ellipsis: true },
    { dataIndex: 'path', title: 'PATH', width: 180, ellipsis: true },
    { dataIndex: 'p_key', title: 'PKEY', width: 90, align: 'center' },
    { dataIndex: 'sort', title: 'SORT', width: 90, align: 'center' },
    {
      dataIndex: 'option',
      title: 'OPTION',
      width: 260,
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <div className="flex justify-center">
            <DeleteButton routerKey={record.key!} />
            <UpdateModalButton
              type="link"
              record={record}
              parentRecord={selectedNode}
            >
              EDIT
            </UpdateModalButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 px-[20px] flex flex-col w-0">
      <div className="flex-shrink-0 mb-[20px]">
        <UpdateModalButton disabled={!selectedNode} parentRecord={selectedNode}>
          {selectedNode
            ? `Create Router For ${selectedNode?.label}`
            : 'Chose TreeNode To Create Router'}
        </UpdateModalButton>
      </div>

      <div className="flex-1">
        <Table
          dataSource={selectedNode?.children ?? []}
          columns={columns}
          scroll={{
            x: '100%',
            y: '100%',
          }}
        />
      </div>
    </div>
  );
}
