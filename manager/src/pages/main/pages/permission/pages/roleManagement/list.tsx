import { List, Table } from '@/components';
import React, { useMemo } from 'react';
import { name as resource } from './';
import type { ColumnsType } from 'antd/es/table';
import type { ManagerRole } from '@/libs/api/schema';
import { Image } from 'antd';
import { TransferModalButton } from './components';

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
        render(_, { id }) {
          return (
            <div className="flex justify-center">
              <TransferModalButton type="permission" role_id={id} />
              <TransferModalButton type="menu" role_id={id} />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <List resource={resource}>
      <Table columns={columns} />
    </List>
  );
}
