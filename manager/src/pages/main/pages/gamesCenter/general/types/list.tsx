import React from 'react';
import {
  CreateButton,
  DeleteButton,
  Filter,
  List,
  Table,
  UpdateButton,
} from '@/components';
import { mainGameCenterGeneralResourceName as resource } from '.';
import type { ColumnsType } from 'antd/es/table';
import type { GameType } from '@/libs/api/schema';
import { Image } from 'antd';
import { Update } from './components';
import { ProFormText } from '@ant-design/pro-components';

export default function ListContainer() {
  const columns: ColumnsType<GameType> = [
    { dataIndex: 'id', title: 'ID', width: 90, align: 'center' },
    { dataIndex: 'name', title: 'NAME' },
    {
      dataIndex: 'logo_url',
      title: 'LOGO',
      align: 'center',
      render(v) {
        return (
          <div className="w-full h-[40px] flex justify-center">
            <div className="w-[40px] h-[40px] object-fit">
              <Image src={v} />
            </div>
          </div>
        );
      },
    },
    { dataIndex: 'filename', title: 'LOGO NAME', ellipsis: true },
    { dataIndex: 'description', title: 'DESCRIPTION', ellipsis: true },
    {
      dataIndex: 'create_time',
      title: 'CREATE TIME',
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'update_time',
      title: 'UPDATE TIME',
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'option',
      title: 'OPTION',
      fixed: 'right',
      align: 'center',
      render(_, record) {
        return (
          <div className="flex justify-center">
            <UpdateButton
              data={record}
              formProps={{ layout: 'horizontal', labelCol: { flex: '100px' } }}
              meta={{ id: record.id }}
            >
              <Update />
            </UpdateButton>

            <DeleteButton id={record.id} />
          </div>
        );
      },
    },
  ];

  return (
    <List
      resource={resource}
      actions={
        <CreateButton
          formProps={{ layout: 'horizontal', labelCol: { flex: '100px' } }}
        >
          <Update />
        </CreateButton>
      }
      filters={
        <Filter>
          <ProFormText name="id" label="ID" />
          <ProFormText name="name" label="Name" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
