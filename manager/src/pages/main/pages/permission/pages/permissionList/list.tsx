import React from 'react';
import {
  List,
  Table,
  Filter,
  DeleteButton,
  UpdateButton,
  CreateButton,
  ModalButton,
} from '@/components/';
import { permissionListResourceName } from './';
import { ProFormText } from '@ant-design/pro-components';
import { ColumnsType } from 'antd/es/table';
import type { Permission } from '@/libs/api/schema';
import { HandleAuthAssociate, Update } from './components';

export default function list() {
  const columns: ColumnsType<Permission> = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      title: 'NAME',
      ellipsis: true,
    },
    {
      dataIndex: 'path',
      title: 'PATH',
      ellipsis: true,
      width: 500,
    },
    {
      dataIndex: 'method',
      title: 'METHOD',
      align: 'center',
      render(value) {
        return <span className=" font-semibold">{value}</span>;
      },
    },
    {
      dataIndex: 'create_time',
      title: 'CREATE_TIME',
      align: 'center',
    },
    {
      dataIndex: 'update_time',
      title: 'UPDATE_TIME',
      align: 'center',
    },
    {
      dataIndex: 'remark',
      title: 'REMARK',
      ellipsis: true,
    },
    {
      dataIndex: 'options',
      title: 'OPTIONS',
      align: 'center',
      fixed: 'right',
      width: 260,
      render(_, record) {
        return (
          <div className="flex justify-center">
            <UpdateButton data={record} meta={{ id: record.id }}>
              <Update />
            </UpdateButton>
            <DeleteButton id={record.id} />
            <ModalButton
              type="link"
              label="ASSOCIATE"
              modalProps={{
                title: 'Auth Associate',
                footer: null,
                width: 1200,
              }}
            >
              <HandleAuthAssociate pid={record.id} />
            </ModalButton>
          </div>
        );
      },
    },
  ];

  return (
    <List
      resource={permissionListResourceName}
      actions={
        <CreateButton>
          <Update />
        </CreateButton>
      }
      filters={
        <Filter>
          <ProFormText label="ID" name="id" />
          <ProFormText label="NAME" name="name" />
          <ProFormText label="PATH" name="path" />
          <ProFormText label="METHOD" name="method" />
        </Filter>
      }
    >
      <Table rowKey="id" columns={columns} />
    </List>
  );
}
