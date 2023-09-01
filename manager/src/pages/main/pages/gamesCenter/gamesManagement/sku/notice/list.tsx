import React from 'react';
import { List, Table, Filter } from '@/components';
import { name as resource } from './';
import { ProFormText } from '@ant-design/pro-components';

export default function ListContainer() {
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
      <Table />
    </List>
  );
}
