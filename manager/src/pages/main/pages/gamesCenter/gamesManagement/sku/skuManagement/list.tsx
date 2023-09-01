import { Filter, List, Table } from '@/components';
import { name as resource } from './';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import type { Sku } from '@/libs/api/schema';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<Sku>>(
    () => [
      { dataIndex: 'spu_id', title: 'SPU ID', align: 'center', width: 90 },
      { dataIndex: 'spu_name', title: 'SPU NAME', ellipsis: true },
      { dataIndex: 'id', title: 'ID', align: 'center', width: 90 },
      { dataIndex: 'name', title: 'NAME', ellipsis: true },
      { dataIndex: 'price', title: 'PRICE', align: 'center' },
      { dataIndex: 'create_time', title: 'CREATE TIME', align: 'center' },
      { dataIndex: 'update_time', title: 'UPDATE TIME', align: 'center' },
    ],
    []
  );

  return (
    <List
      resource={resource}
      filters={
        <Filter>
          <ProFormText label="SpuID" name="spu_id" />
          <ProFormText label="SpuName" name="spu_name" />
          <ProFormText label="ID" name="id" />
          <ProFormText label="Name" name="name" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
