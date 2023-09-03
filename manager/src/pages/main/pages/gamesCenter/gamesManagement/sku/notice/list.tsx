import React, { useMemo } from 'react';
import { List, Table, Filter, DeleteButton } from '@/components';
import { name as resource } from './';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { SkuNotice } from '@/libs/api/schema';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<SkuNotice>>(
    () => [
      {
        dataIndex: 'sku_id',
        title: 'SKU ID',
        width: 90,
        align: 'center',
      },
      {
        dataIndex: 'sku_name',
        title: 'SKU NAME',
        ellipsis: true,
      },
      {
        dataIndex: 'id',
        title: 'ID',
        width: 90,
        align: 'center',
      },
      {
        dataIndex: 'title',
        title: 'TITLE',
        ellipsis: true,
      },
      {
        dataIndex: 'publish_type',
        title: 'PUBLISH TYPE',
        align: 'center',
      },
      {
        dataIndex: 'publish_time',
        title: 'PUBLISH TIME',
        align: 'center',
      },
      {
        dataIndex: 'published',
        title: 'PUBLISHED',
        align: 'center',
        render(v) {
          return v ? 'published' : 'unpublished';
        },
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
        align: 'center',
        title: 'OPTION',
        dataIndex: 'option',
        fixed: 'right',
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
          <ProFormText label="SkuID" name="sku_id" />
          <ProFormText label="SkuName" name="sku_name" />
          <ProFormText label="ID" name="id" />
          <ProFormText label="Title" name="title" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
