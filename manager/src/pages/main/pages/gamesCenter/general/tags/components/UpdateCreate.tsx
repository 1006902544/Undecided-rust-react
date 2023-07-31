import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { ProFormHexColorPicker } from '@/components';
import React from 'react';
import styled from 'styled-components';
import { Button, Upload } from 'antd';
import { getToken } from '@/utils';

export default function UpdateCreate() {
  return (
    <Container>
      <ProFormText
        name="name"
        label="Name"
        fieldProps={{
          showCount: true,
          maxLength: 20,
        }}
        rules={[
          {
            required: true,
            message: 'please input tag name',
          },
        ]}
      />

      <ProFormHexColorPicker
        name="bg_color"
        label="BackgroundColor"
        defaultColor="#1e1e1e"
        rules={[{ required: true, message: 'please input background color' }]}
      />

      <ProFormHexColorPicker
        name="border_color"
        label="BorderColor"
        defaultColor="#acacac"
        rules={[{ required: true, message: 'please input border color' }]}
      />

      <ProFormHexColorPicker
        name="text_color"
        label="TextColor"
        defaultColor="#acacac"
        rules={[{ required: true, message: 'please input text color' }]}
      />

      <ProForm.Item shouldUpdate label="Preview">
        {({ getFieldsValue }) => {
          const { bg_color, border_color, text_color, name } = getFieldsValue();
          return (
            <div
              className="px-[8px] py-[2px] rounded-[4px] inline-block"
              style={{
                backgroundColor: bg_color,
                border: `1px solid ${border_color}`,
                color: text_color,
              }}
            >
              {name ?? 'Tags Preview'}
            </div>
          );
        }}
      </ProForm.Item>

      <ProFormTextArea
        name="description"
        label="Description"
        fieldProps={{
          showCount: true,
          maxLength: 100,
        }}
      />

      <Upload
        action={process.env.REACT_APP_BASE_API_URL + '/manager/upload'}
        headers={{
          Authorization: getToken()!,
        }}
        data={{
          name: 'aaaaa.png',
        }}
      >
        <Button>Upload</Button>
      </Upload>
    </Container>
  );
}

const Container = styled.div``;
