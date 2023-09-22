import React, { useMemo } from 'react';
import { name as resource } from '.';
import {
  List,
  Table,
  UpdateButton,
  CreateButton,
  DeleteButton,
} from '@/components';
import type { ColumnsType } from 'antd/es/table';
import type { RoleAuditRow } from '@/libs/api/schema';
import { Audit } from './components';

export default function ManagerRoleAudit() {
  const columns = useMemo<ColumnsType<RoleAuditRow>>(
    () => [
      { dataIndex: 'id', title: 'ID', align: 'center', width: 120 },
      { dataIndex: 'role_name', title: 'RoleName', ellipsis: true },
      { dataIndex: 'username', title: 'Username', ellipsis: true },
      { dataIndex: 'name', title: 'Name', ellipsis: true },
      { dataIndex: 'email', title: 'Email', ellipsis: true },
      {
        dataIndex: 'status',
        title: 'Status',
        align: 'center',
        width: 90,
        render(v) {
          switch (v) {
            case 1:
              return 'Pass';
            case 2:
              return 'Refused';
            default:
              return 'Pending';
          }
        },
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
        fixed: 'right',
        align: 'center',
        render(_, { role_name, status, id }) {
          return (
            <div className="flex justify-center">
              {status === 1 ? (
                <CreateButton
                  meta={{ status, role_name }}
                  modalProps={{ title: 'Review', footer: null }}
                  formProps={{
                    layout: 'horizontal',
                    labelCol: { flex: '90px' },
                  }}
                  label="review"
                  type="link"
                >
                  <Audit status={status} />
                </CreateButton>
              ) : (
                <UpdateButton
                  label="audit"
                  modalProps={{ title: 'Audit' }}
                  formProps={{
                    layout: 'horizontal',
                    labelCol: { flex: '90px' },
                  }}
                  meta={{ id }}
                  data={{
                    role_name,
                  }}
                >
                  <Audit status={status} />
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

  return (
    <List resource={resource}>
      <Table columns={columns} />
    </List>
  );
}
