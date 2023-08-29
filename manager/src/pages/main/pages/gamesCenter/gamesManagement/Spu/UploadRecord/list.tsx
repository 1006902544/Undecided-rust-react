import React, { useMemo } from 'react';
import { DeleteButton, Filter, List, Table } from '@/components';
import { name as resource } from './';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import type { SpuUpdateRecord } from '@/libs/api/schema';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<SpuUpdateRecord>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'spu_id',
        title: 'SPU ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'title',
        title: 'TITLE',
      },
      {
        dataIndex: 'create_time',
        title: 'CREATE TIME',
        align: 'center',
      },
      {
        dataIndex: 'update_time',
        title: 'UPDATE TIME',
        align: 'center',
      },
      {
        dataIndex: 'option',
        title: 'OPTION',
        fixed: 'right',
        align: 'center',
        render(_, { id }) {
          return (
            <div className="flex justify-center">
              <DeleteButton id={id} />
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
      filters={
        <Filter>
          <ProFormText label="SpuID" name="spu_id" />
          <ProFormText label="ID" name="id" />
          <ProFormText label="Name" name="name" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
