import {
  CreateButton,
  DeleteButton,
  Filter,
  List,
  Table,
  UpdateButton,
} from '@/components';
import React, { useMemo } from 'react';
import { name as resource } from './';
import type { ColumnsType } from 'antd/es/table';
import type { ManagerRole } from '@/libs/api/schema';
import { Image } from 'antd';
import { TransferModalButton, Update } from './components';
import { ProFormText } from '@ant-design/pro-components';

export default function RoleManagement() {
  const columns = useMemo<ColumnsType<ManagerRole>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        width: 120,
        align: 'center',
      },
      {
        dataIndex: 'icon',
        title: 'Icon',
        align: 'center',
        render(v) {
          return v && <Image src={v} height={40} />;
        },
      },
      {
        dataIndex: 'name',
        title: 'Name',
        ellipsis: true,
      },
      {
        dataIndex: 'remark',
        title: 'Remark',
        ellipsis: true,
      },
      {
        dataIndex: 'option',
        title: 'Option',
        align: 'center',
        width: 360,
        fixed: 'right',
        render(_, record) {
          return (
            <div className="flex justify-center">
              <TransferModalButton type="permission" role_id={record.id} />
              <TransferModalButton type="menu" role_id={record.id} />
              <UpdateButton label="edit" data={record} meta={{ id: record.id }}>
                <Update />
              </UpdateButton>
              <DeleteButton id={record.id}>delete</DeleteButton>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <List
      resource={resource}
      actions={
        <CreateButton>
          <Update />
        </CreateButton>
      }
      filters={
        <Filter>
          <ProFormText label="ID" name="id" />
          <ProFormText label="Name" name="name" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
