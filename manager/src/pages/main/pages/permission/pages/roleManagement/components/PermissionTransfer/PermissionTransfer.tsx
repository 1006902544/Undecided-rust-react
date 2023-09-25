import { Transfer } from '../';
import React, { useMemo } from 'react';
import { name } from '.';
import type { ColumnsType } from 'antd/es/table';
import type { ManagerRolePermissionRow } from '@/libs/api/schema';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';

export default function PermissionTransfer({ role_id }: { role_id: number }) {
  const columns = useMemo<ColumnsType<ManagerRolePermissionRow>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
        width: 120,
      },

      {
        dataIndex: 'name',
        title: 'Name',
        ellipsis: true,
      },
      {
        dataIndex: 'method',
        title: 'Method',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'path',
        title: 'Path',
        ellipsis: true,
      },
    ],
    []
  );

  return (
    <Transfer
      titles={['Permissions', 'Selected']}
      resource={{ name, filterValues: { role_id } }}
      table={{
        columns,
        rowKey: 'id',
      }}
      params={{ role_id }}
      filter={[
        <ProFormText name="name" label="Name" key="name" />,
        <ProFormText name="path" label="Path" key="path" />,
        <ProFormSelect
          name="method"
          label="Method"
          key="method"
          options={[
            {
              label: 'GET',
              value: 'GET',
            },
            {
              label: 'POST',
              value: 'POST',
            },
            {
              label: 'DELETE',
              value: 'DELETE',
            },
          ]}
        />,
      ]}
    />
  );
}
