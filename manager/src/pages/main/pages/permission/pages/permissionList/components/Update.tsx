import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';

export default function Update() {
  return (
    <>
      <ProFormText
        name="name"
        label="Name"
        rules={[{ required: true, message: 'please input permission name' }]}
      />
      <ProFormText name="path" label="Path" />
      <ProFormSelect
        name="method"
        label="Method"
        request={async () => [
          { value: 'GET' },
          { value: 'POST' },
          { value: 'DELETE' },
        ]}
      />
      <ProFormTextArea
        name="remark"
        label="Remark"
        fieldProps={{ maxLength: 200, showCount: true }}
      />
    </>
  );
}
