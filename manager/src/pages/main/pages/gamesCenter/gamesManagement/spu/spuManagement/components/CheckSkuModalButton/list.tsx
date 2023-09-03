import React, { useMemo } from 'react';
import { name as resource } from './';
import { CreateButton, DeleteButton, Filter, List, Table } from '@/components';
import { ProFormText } from '@ant-design/pro-components';
import CreateSku from './CreateSku';
import type { ColumnsType } from 'antd/es/table';
import type { Sku } from '@/libs/api/schema';
import { Image } from 'antd';

interface IProps {
  spu_id: number;
  spu_name: string;
}

export default function ListContainer({ spu_id, spu_name }: IProps) {
  const columns = useMemo<ColumnsType<Sku>>(
    () => [
      {
        dataIndex: 'spu_id',
        title: 'SPU ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'spu_name',
        title: 'SPU Name',
        ellipsis: true,
      },
      { dataIndex: 'id', title: 'ID', align: 'center', width: 90 },
      {
        dataIndex: 'name',
        title: 'NAME',
        ellipsis: true,
      },
      {
        dataIndex: 'price',
        title: 'PRICE',
        align: 'center',
        render(v) {
          return v.toFixed(2);
        },
      },
      {
        dataIndex: 'cover_url',
        title: 'COVER',
        align: 'center',
        render(v) {
          return <Image src={v} height={60} />;
        },
      },
      {
        dataIndex: 'issue_time',
        title: 'ISSUE TIME',
        align: 'center',
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
        align: 'center',
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
      filterValue={{ spu_id }}
      filters={
        <Filter>
          <ProFormText name="id" label="ID" />
          <ProFormText name="name" label="Name" />
        </Filter>
      }
      actions={
        <CreateButton
          meta={{
            spu_id,
            spu_name,
          }}
        >
          <CreateSku />
        </CreateButton>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
