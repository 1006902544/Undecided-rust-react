import { Transfer } from '../';
import React, { useMemo } from 'react';
import { name } from '.';
import type { ColumnsType } from 'antd/es/table';
import type { ManagerRolePermissionRow } from '@/libs/api/schema';
import { ProFormText } from '@ant-design/pro-components';

export default function PermissionTransfer({ role_id }: { role_id: number }) {
  const columns = useMemo<ColumnsType<ManagerRolePermissionRow>>(
    () => [
      {
        dataIndex: 'key',
        title: 'Key',
        align: 'center',
        width: 120,
      },
      {
        dataIndex: 'label',
        title: 'Label',
        ellipsis: true,
      },
      {
        dataIndex: 'path',
        title: 'Path',
        ellipsis: true,
      },
      {
        dataIndex: 'sort',
        title: 'Sort',
        align: 'center',
        width: 90,
      },
    ],
    []
  );

  return (
    <Transfer
      titles={['Menus', 'Selected']}
      resource={{ name, filterValues: { role_id } }}
      table={{
        columns,
      }}
      params={{ role_id }}
      filter={<ProFormText name="label" label="Label" />}
    />
  );
}
