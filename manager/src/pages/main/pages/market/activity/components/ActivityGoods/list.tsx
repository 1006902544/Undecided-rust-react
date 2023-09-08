import { Filter, List, Table } from '@/components';
import React, { useMemo } from 'react';
import { name as resource } from './';
import { useUpdateContext } from '../UpdateContext';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import type { ActivityGoods } from '@/libs/api/schema';

export default function ListContainer() {
  const { data, id } = useUpdateContext();

  const columns = useMemo<ColumnsType<ActivityGoods>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
      },
      {
        dataIndex: 'spu_id',
        title: 'spu_id',
        align: 'center',
      },
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
      },
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
      },
    ],
    []
  );

  return (
    <div className="flex h-[99%]">
      <List
        resource={resource}
        filterValue={{
          id,
          goods_type: data?.base.activity_type,
        }}
        filters={
          <Filter>
            <ProFormText label="SpuName" name="spu_name" />
            <ProFormText label="SkuName" name="sku_name" />
          </Filter>
        }
      >
        <Table />
      </List>
    </div>
  );
}
