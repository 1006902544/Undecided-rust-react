import { ProFormEditor, Toolbar, useListContext } from '@/components';
import {
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';

export default function CreateSkuNotice() {
  return (
    <div>
      <ProFormText label="SkuID" name="sku_id" readonly />

      <ProFormText label="SkuName" name="sku_name" readonly />

      <ProFormText
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'please input sku title',
          },
        ]}
        fieldProps={{
          minLength: 1,
          maxLength: 50,
          showCount: true,
        }}
      />

      <ProFormEditor
        label="Content"
        name="content"
        rules={[
          {
            required: true,
            message: 'please input sku content',
          },
        ]}
        fieldProps={{
          children: <Toolbar />,
        }}
      />

      <ProFormSelect
        label="PublishType"
        name="publish_type"
        rules={[
          {
            required: true,
            message: 'please chose sku publish type',
          },
        ]}
        options={[
          {
            label: 'auto',
            value: 'auto',
          },
          {
            label: 'manual',
            value: 'manual',
          },
        ]}
      />

      <ProForm.Item
        shouldUpdate={(pre, cur) => pre.publish_type !== cur.publish_type}
      >
        {({ getFieldValue }) => {
          const publishType = getFieldValue('publish_type');
          if (publishType === 'auto') {
            return (
              <ProFormDateTimePicker
                labelCol={{ flex: '90px' }}
                label="PublishTime"
                name="publish_time"
                rules={[
                  {
                    required: true,
                    message: 'please input sku publish time',
                  },
                ]}
              />
            );
          } else {
            return null;
          }
        }}
      </ProForm.Item>
    </div>
  );
}
