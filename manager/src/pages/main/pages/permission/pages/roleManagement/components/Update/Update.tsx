import { ProFormDraggerUpload } from '@/components';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';

export default function Update() {
  return (
    <>
      <ProFormText
        label="Name"
        name="name"
        rules={[{ required: true, message: 'please input role name' }]}
        fieldProps={{
          showCount: true,
          maxLength: 50,
        }}
      />

      <ProFormDraggerUpload
        label="Icon"
        name="icon"
        fieldProps={{ maxCount: 1 }}
      />

      <ProFormTextArea
        label="Remark"
        name="remark"
        fieldProps={{
          showCount: true,
          maxLength: 200,
        }}
      />
    </>
  );
}
