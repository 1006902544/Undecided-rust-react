import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export default function Audit({ status }: { status: number }) {
  return (
    <div className="mt-[24px]">
      <ProFormText label="RoleName" name="role_name" readonly />

      <ProFormSelect
        label="Status"
        name="status"
        rules={[{ required: true, message: 'please chose status' }]}
        options={[
          {
            label: 'Pass',
            value: 1,
          },
          {
            label: 'Refuse',
            value: 2,
          },
        ]}
        readonly={status === 1}
      />
    </div>
  );
}
