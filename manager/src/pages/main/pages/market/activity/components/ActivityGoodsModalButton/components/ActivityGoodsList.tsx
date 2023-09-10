import { Filter, List, Table } from '@/components';
import React, { useMemo } from 'react';
import { name as resource } from '../';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import type { SpuSkuTree } from '@/libs/api/schema';
import { Button, Image } from 'antd';
import type { Goods } from './ActivityGoods';

interface IProps {
  selected: Goods[];
  setSelected: React.Dispatch<React.SetStateAction<Goods[]>>;
}

export default function ActivityGoodsList({ selected, setSelected }: IProps) {
  const columns = useMemo<ColumnsType<SpuSkuTree>>(
    () => [
      { dataIndex: 'spu_id', title: 'SPU ID', width: 90, align: 'center' },
      {
        dataIndex: 'spu_name',
        title: 'SPU NAME',
        ellipsis: true,
      },
      { dataIndex: 'sku_id', title: 'SKU ID', width: 90, align: 'center' },
      {
        dataIndex: 'sku_name',
        title: 'SKU NAME',
        ellipsis: true,
      },
      {
        dataIndex: 'cover',
        title: 'COVER',
        align: 'center',
        render(_, { cover_url }) {
          return <Image src={cover_url} height={40} />;
        },
      },
      {
        dataIndex: 'price',
        title: 'PRICE',
        align: 'center',
        render(v) {
          return `$${v}`;
        },
      },
      {
        dataIndex: 'option',
        title: 'OPTION',
        align: 'center',
        fixed: 'right',
        render() {
          return (
            <div className="flex justify-center">
              <Button type="link">AddToActivity</Button>
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
          <ProFormText label="SpuName" name="spu_name" />
        </Filter>
      }
    >
      <Table
        columns={columns}
        rowSelection={{
          selectedRowKeys: selected.map(
            ({ spu_id, sku_id }) => `${spu_id}${sku_id ? `-${sku_id}` : ''}`
          ),
          onChange(_, selectedRows) {
            setSelected(
              selectedRows.map(
                ({ spu_id, spu_name, sku_id, sku_name, price }) => ({
                  spu_id,
                  spu_name,
                  sku_id,
                  sku_name,
                  price,
                })
              )
            );
          },
          preserveSelectedRowKeys: true,
        }}
        rowKey={({ spu_id, sku_id }) =>
          `${spu_id}${sku_id ? `-${sku_id}` : ''}`
        }
      />
    </List>
  );
}
