import React from 'react';
import { List, StatusButton, Table } from '@/components';
import { resourceName } from '.';
import type { ColumnsType } from 'antd/es/table';
import type { AssociateAuthLimit } from '@/libs/api/schema';

interface IProps {
  pid: number;
}

export default function ListContainer({ pid }: IProps) {
  const columns: ColumnsType<AssociateAuthLimit> = [
    { dataIndex: 'id', title: 'ID', align: 'center' },
    { dataIndex: 'name', title: 'NAME', ellipsis: true },
    { dataIndex: 'username', title: 'USERNAME', ellipsis: true },
    { dataIndex: 'age', title: 'AGE' },
    { dataIndex: 'create_time', title: 'CREATE_TIME', align: 'center' },
    { dataIndex: 'update_time', title: 'UPDATE_TIME', align: 'center' },
    {
      dataIndex: 'associated',
      title: 'ASSOCIATED',
      align: 'center',
      fixed: 'right',
      render(v, { id }) {
        return (
          <StatusButton data={{ uid: id, pid: pid, associated: v }}>
            {v === 1 ? 'DISASSOCIATE' : 'ASSOCIATE'}
          </StatusButton>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <List resource={resourceName} filterValue={{ pid }}>
        <Table rowKey="id" columns={columns} />
      </List>
    </div>
  );
}
