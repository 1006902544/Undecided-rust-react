import React from 'react';
import type { PriRoute } from '../menuManagement';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface IProps {
  dataSource: PriRoute[];
}

export default function RoutesLimit({ dataSource }: IProps) {
  const columns: ColumnsType<PriRoute> = [
    { dataIndex: 'key', title: 'KEY', width: 60, align: 'center' },
    { dataIndex: 'label', title: 'LABEL', width: 180, ellipsis: true },
    { dataIndex: 'path', title: 'PATH', width: 180, ellipsis: true },
    { dataIndex: 'p_key', title: 'PKEY', width: 60, align: 'center' },
    { dataIndex: 'sort', title: 'SORT', width: 60, align: 'center' },
    {
      dataIndex: 'option',
      title: 'OPTION',
      width: 180,
      align: 'center',
      render(_, { key }) {
        return (
          <div className="flex justify-center">
            <Button type="link" style={{ color: 'red' }}>
              DELETE
            </Button>
            <Button type="link">EDIT</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 px-[20px]">
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{
          x: '100%',
          y: '100%',
        }}
      />
    </div>
  );
}
