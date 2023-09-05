import { List, Table, Filter } from '@/components';
import { name as resource } from './';
import React, { useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '@/libs/api/schema';
import { Image } from 'antd';
import { DetailModalButton } from './components';
import banned from '@/assets/images/banned.png';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<User>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'username',
        title: 'USERNAME',
        ellipsis: true,
      },
      {
        dataIndex: 'nickname',
        title: 'NICKNAME',
        ellipsis: true,
      },
      {
        dataIndex: 'avatar_url',
        align: 'center',
        title: 'AVATAR',
        render(v, { is_banned }) {
          return is_banned ? (
            <div className="flex justify-center h-[60px] relative">
              <img src={v} className="h-full object-contain z-[1]" alt="" />
              <img
                src={banned}
                className="h-[60px] w-full object-contain z-[2] absolute top-0 left-[50%] translate-x-[-50%] opacity-[0.7]"
                alt=""
              />
            </div>
          ) : (
            <Image src={v} height={60} />
          );
        },
      },
      {
        dataIndex: 'birthday',
        align: 'center',
        title: 'BIRTHDAY',
      },
      {
        dataIndex: 'gender',
        align: 'center',
        title: 'GENDER',
        render(v) {
          return v === 0 ? 'unknown' : v === 1 ? 'Male' : 'Female';
        },
      },
      {
        dataIndex: 'create_time',
        align: 'center',
        title: 'CREATE TIME',
      },
      {
        dataIndex: 'update_time',
        align: 'center',
        title: 'UPDATE TIME',
      },
      {
        dataIndex: 'option',
        title: 'OPTION',
        align: 'center',
        fixed: 'right',
        render(_, { id }) {
          return (
            <div className="flex justify-center">
              <DetailModalButton id={id} />
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
          <ProFormText label="ID" name="id" />
          <ProFormText label="Username" name="username" />
          <ProFormText label="Nickname" name="nickname" />
          <ProFormSelect
            label="Gender"
            name="gender"
            options={[
              { label: 'unknown', value: 0 },
              { label: 'male', value: 1 },
              { label: 'female', value: 2 },
            ]}
          />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
