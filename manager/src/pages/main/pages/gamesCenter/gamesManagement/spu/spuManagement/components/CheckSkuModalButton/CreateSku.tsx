import {
  ProFormDraggerUpload,
  ProFormEditor,
  ProFormTextNumber,
  Toolbar,
} from '@/components';
import { ProFormDateTimePicker, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export default function CreateSku() {
  return (
    <div>
      <ProFormText
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'please input sku name',
          },
        ]}
      />

      <ProFormDraggerUpload
        label="Cover"
        name="cover"
        rules={[
          {
            required: true,
            message: 'please input sku cover',
          },
        ]}
      />

      <ProFormTextNumber
        label="Price"
        name="price"
        fieldProps={{
          min: 0,
          max: 9999,
          precision: 2,
        }}
        rules={[
          {
            required: true,
            message: 'please input sku price',
          },
        ]}
      />

      <ProFormDateTimePicker
        label="IssueTime"
        name="issue_time"
        rules={[
          {
            required: true,
            message: 'please input sku issue time',
          },
        ]}
      />

      <ProFormEditor
        label="Description"
        name="description"
        fieldProps={{
          children: <Toolbar />,
        }}
      />
    </div>
  );
}
