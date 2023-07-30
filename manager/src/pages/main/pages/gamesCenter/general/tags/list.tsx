import React from 'react';
import {
  CreateButton,
  DeleteButton,
  Filter,
  List,
  Table,
  UpdateButton,
} from '@/components';
import { gamesCenterGeneralTagsResourceName } from './index';
import { ColumnsType } from 'antd/es/table';
import type { Tag } from '@/libs/api/schema';
import { ProFormText } from '@ant-design/pro-components';
import { UpdateCreate } from './components';

export default function ListContainer() {
  const columns: ColumnsType<Tag> = [
    { dataIndex: 'id', title: 'ID', align: 'center', width: 100 },
    { dataIndex: 'name', title: 'NAME', ellipsis: true },
    {
      dataIndex: 'preview',
      title: 'PREVIEW',
      align: 'center',
      render(_, { name, bg_color, border_color, text_color }) {
        return (
          <div
            className="px-[8px] py-[2px] rounded-[4px] inline-block"
            style={{
              backgroundColor: bg_color,
              border: `1px solid ${border_color}`,
              color: text_color,
            }}
          >
            {name}
          </div>
        );
      },
    },
    { dataIndex: 'bg_color', title: 'BG-COLOR', align: 'center' },
    { dataIndex: 'border_color', title: 'BORDER-COLOR', align: 'center' },
    { dataIndex: 'text_color', title: 'TEXT_COLOR', align: 'center' },
    { dataIndex: 'description', title: 'DESCRIPTION', ellipsis: true },
    { dataIndex: 'create_time', title: 'CREATE-TIME', align: 'center' },
    { dataIndex: 'update_time', title: 'UPDATE-TIME', align: 'center' },
    {
      dataIndex: 'option',
      title: 'OPTION',
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <div className="flex justify-center">
            <UpdateButton data={record} meta={{ id: record.id }}>
              <UpdateCreate />
            </UpdateButton>
            <DeleteButton id={record.id} />
          </div>
        );
      },
    },
  ];

  return (
    <List
      resource={gamesCenterGeneralTagsResourceName}
      filters={
        <Filter>
          <ProFormText name="id" label="ID" />
          <ProFormText name="name" label="Name" />
        </Filter>
      }
      actions={
        <CreateButton
          formProps={{ layout: 'horizontal', labelCol: { flex: '140px' } }}
        >
          <UpdateCreate />
        </CreateButton>
      }
    >
      <Table columns={columns} rowKey="id" />
    </List>
  );
}
