import React, { useMemo } from 'react';
import { name as resource } from '.';
import { List, Table } from '@/components';
import type { ColumnsType } from 'antd/es/table';
import type { ManagerInfo } from '@/libs/api/schema';
import { Image } from 'antd';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<ManagerInfo>>(
    () => [
      { dataIndex: 'id', title: 'ID', width: 120, align: 'center' },
      { dataIndex: 'name', title: 'Name', ellipsis: true },
      { dataIndex: 'username', title: 'Username', ellipsis: true },
      {
        dataIndex: 'avatar',
        title: 'Avatar',
        align: 'center',
        render(v) {
          return v && <Image src={v} height={40} />;
        },
      },
      { dataIndex: 'mobile', title: 'Mobile', align: 'center' },
      { dataIndex: 'email', title: 'Email', ellipsis: true },
      {
        dataIndex: 'role_name',
        title: 'RoleName',
        align: 'center',
        ellipsis: true,
      },
      {
        dataIndex: 'gender',
        title: 'Gender',
        width: 90,
        align: 'center',
        render(v) {
          switch (v) {
            case 1:
              return 'Male';
            case 2:
              return 'Female';
            default:
              return 'Unknown';
          }
        },
      },
      { dataIndex: 'age', title: 'Age', width: 90, align: 'center' },
      { dataIndex: 'update_time', title: 'UpdateTime', align: 'center' },
      { dataIndex: 'create_time', title: 'CreateTime', align: 'center' },
      {
        dataIndex: 'option',
        title: 'Option',
        align: 'center',
        fixed: 'right',
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
