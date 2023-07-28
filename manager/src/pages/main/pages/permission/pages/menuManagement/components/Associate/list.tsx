import React from 'react';
import { List, Table } from '@/components';
import { permissionsMenuRouterAssociateResourceName } from '.';
import type { AssociateRouterAuthLimit } from '@/libs/api/schema';
import { ColumnsType } from 'antd/es/table';

interface IProps {
  rkey: number;
}

export default function ListContainer({ rkey }: IProps) {
  const columns: ColumnsType<AssociateRouterAuthLimit> = [
    { dataIndex: 'id', title: 'ID' },
    { dataIndex: 'name', title: 'NAME' },
    { dataIndex: 'username', title: 'USERNAME' },
    { dataIndex: 'age', title: 'AGE' },
    { dataIndex: 'create_time', title: 'CREATE TIME' },
    { dataIndex: 'update_time', title: 'UPDATE TIME' },
    { dataIndex: 'associated', title: 'Option' },
  ];

  return (
    <List
      resource={permissionsMenuRouterAssociateResourceName}
      filterValue={{ rkey }}
    >
      <Table columns={columns} />
    </List>
  );
}
