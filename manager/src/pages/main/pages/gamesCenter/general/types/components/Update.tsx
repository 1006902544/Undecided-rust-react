import { ProFormDraggerUpload } from '@/components';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';

export default function Update() {
  return (
    <>
      <ProFormText
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'please input type name' },
          { message: "type name's length should be 3 - 20", min: 3 },
        ]}
        fieldProps={{
          maxLength: 20,
          showCount: true,
        }}
      />

      <ProFormDraggerUpload
        name="logo"
        label="Logo"
        rules={[{ required: true, message: 'please upload type logo' }]}
        required
        fieldProps={{
          maxCount: 1,
        }}
      />

      <ProFormTextArea
        name="description"
        label="Description"
        fieldProps={{ maxLength: 200, showCount: true }}
      />
    </>
  );
}
