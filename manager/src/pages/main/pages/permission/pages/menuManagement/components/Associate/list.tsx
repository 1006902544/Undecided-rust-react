import React from 'react';
import {
  Filter,
  List,
  StatusButton,
  Table,
  useMenuContext,
} from '@/components';
import { permissionsMenuRouterAssociateResourceName } from '.';
import type { AssociateRouterAuthLimit } from '@/libs/api/schema';
import { ColumnsType } from 'antd/es/table';
import { ProFormText } from '@ant-design/pro-components';

interface IProps {
  rkey: number;
}

export default function ListContainer({ rkey }: IProps) {
  const menuContext = useMenuContext();

  const onSuccess = () => {
    menuContext?.refetch();
  };

  const columns: ColumnsType<AssociateRouterAuthLimit> = [
    { dataIndex: 'id', title: 'ID', width: 60, align: 'center' },
    { dataIndex: 'name', title: 'NAME', ellipsis: true },
    { dataIndex: 'username', title: 'USERNAME', ellipsis: true },
    { dataIndex: 'age', title: 'AGE' },
    { dataIndex: 'create_time', title: 'CREATE TIME', align: 'center' },
    { dataIndex: 'update_time', title: 'UPDATE TIME', align: 'center' },
    {
      dataIndex: 'associated',
      title: 'Option',
      align: 'center',
      fixed: 'right',
      render(v, record) {
        return (
          <StatusButton
            onSuccess={onSuccess}
            data={{ aid: record.id, rkey, associate: v === 1 ? 0 : 1 }}
          >
            {v ? 'DISASSOCIATE' : 'ASSOCIATE'}
          </StatusButton>
        );
      },
    },
  ];

  return (
    <List
      resource={permissionsMenuRouterAssociateResourceName}
      filterValue={{ rkey }}
      filters={
        <Filter>
          <ProFormText name="id" label="ID" />
          <ProFormText name="name" label="NAME" />
        </Filter>
      }
    >
      <Table columns={columns} rowKey="id" />
    </List>
  );
}
