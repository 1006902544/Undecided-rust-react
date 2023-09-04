import { ProFormEditor, Toolbar } from '@/components';
import {
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import React from 'react';

export default function CreateNotation() {
  return (
    <div>
      <ProFormText label="SpuId" name="spuId" readonly />
      <ProFormText label="SpuName" name="spuName" readonly />
      <ProFormText
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'please input title',
          },
        ]}
        fieldProps={{
          minLength: 1,
          maxLength: 50,
          showCount: true,
        }}
      />
      <ProFormEditor
        fieldProps={{ children: <Toolbar /> }}
        label="Content"
        name="content"
        rules={[{ required: true, message: 'please input notice content' }]}
      />
      <ProFormSelect
        label="PublishType"
        name="publishType"
        rules={[{ required: true, message: 'please input publish type' }]}
        options={[
          { label: 'manual', value: 'manual' },
          { label: 'auto', value: 'auto' },
        ]}
      />

      <ProForm.Item
        shouldUpdate={(pre, cur) => pre.publishType !== cur.publishType}
        noStyle
      >
        {({ getFieldValue }) =>
          getFieldValue('publishType') === 'auto' ? (
            <ProFormDateTimePicker
              name="publishTime"
              label="PublishTime"
              rules={[
                { required: true, message: 'please chose notice publish time' },
              ]}
            />
          ) : null
        }
      </ProForm.Item>
    </div>
  );
}
