import React from 'react';
import { name as resource } from './';
import { CreateButton, Filter, List, Table } from '@/components';
import { ProFormText } from '@ant-design/pro-components';
import CreateSku from './CreateSku';

interface IProps {
  spu_id: number;
  spu_name: string;
}

export default function ListContainer({ spu_id, spu_name }: IProps) {
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
      <Table />
    </List>
  );
}
