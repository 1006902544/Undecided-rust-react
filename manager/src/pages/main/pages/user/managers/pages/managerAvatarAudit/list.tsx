import { DeleteButton, Filter, List, Table, UpdateButton } from '@/components';
import React, { useEffect, useMemo, useState } from 'react';
import { name as resource } from '.';
import type { ColumnsType } from 'antd/es/table';
import type { ManagerAvatarAuditRow } from '@/libs/api/schema';
import { Image, Radio } from 'antd';
import { Audit } from './components';
import { ProFormText } from '@ant-design/pro-components';

export default function ListContainer() {
  useEffect(() => {}, []);

  const columns = useMemo<ColumnsType<ManagerAvatarAuditRow>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
        width: 120,
      },
      {
        dataIndex: 'name',
        title: 'Name',
        ellipsis: true,
      },
      {
        dataIndex: 'avatar',
        title: 'Avatar',
        align: 'center',
        render(v) {
          return <Image src={v} height={40} />;
        },
      },
      {
        dataIndex: 'username',
        title: 'Username',
        ellipsis: true,
      },
      {
        dataIndex: 'status',
        title: 'Status',
        align: 'center',
        width: 90,
        render(v) {
          return v === 1 ? 'Pass' : v === 2 ? 'Refuse' : 'Pending';
        },
      },
      {
        dataIndex: 'reason',
        title: 'Reason',
        ellipsis: true,
      },
      {
        dataIndex: 'update_time',
        title: 'UpdateTime',
        align: 'center',
      },
      {
        dataIndex: 'create_time',
        title: 'CreateTime',
        align: 'center',
      },
      {
        dataIndex: 'option',
        title: 'Option',
        align: 'center',
        fixed: 'right',
        render(_, { id, avatar, status, reason }) {
          return (
            <div className="flex justify-center">
              {status === 0 && (
                <UpdateButton
                  label="audit"
                  meta={{ id }}
                  data={{ avatar, status, reason }}
                >
                  <Audit />
                </UpdateButton>
              )}

              <DeleteButton id={id}>delete</DeleteButton>
            </div>
          );
        },
      },
    ],
    []
  );

  const [status, setStatus] = useState<string | number>('all');

  return (
    <List
      resource={resource}
      filters={
        <Filter labelWidth={90}>
          <ProFormText name="id" label="ID" />
          <ProFormText name="name" label="Name" />
          <ProFormText name="username" label="Username" />
        </Filter>
      }
      filterValue={{ status }}
      actions={
        <Radio.Group
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          optionType="button"
          buttonStyle="solid"
          options={[
            {
              label: 'All',
              value: 'all',
            },
            {
              label: 'Pending',
              value: 0,
            },
            {
              label: 'Pass',
              value: 1,
            },
            {
              label: 'Refuse',
              value: 2,
            },
          ]}
        />
      }
    >
      <Table columns={columns} />
    </List>
  );
}
