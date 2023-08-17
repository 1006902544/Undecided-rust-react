import {
  Editor,
  ProFormDraggerUpload,
  ProFormEditor,
  Toolbar,
} from '@/components';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';

export default function Update() {
  const [form] = ProForm.useForm();

  return (
    <Container form={form} layout="horizontal" labelCol={{ flex: '120px' }}>
      <Row>
        <Col span={8}>
          <ProFormText
            name="name"
            label="Name"
            rules={[{ required: true, message: 'please input company name' }]}
            fieldProps={{
              maxLength: 50,
              showCount: true,
            }}
          />
        </Col>
        <Col span={16}></Col>

        <Col span={8}>
          <ProFormDraggerUpload
            name="logo"
            label="Logo"
            rules={[{ required: true, message: 'please upload type logo' }]}
            required
            fieldProps={{
              maxCount: 1,
            }}
          />
        </Col>
        <Col span={16}></Col>

        <Col span={8}>
          <ProFormSelect
            name="region"
            label="Region"
            fieldProps={{
              maxLength: 200,
            }}
          />
        </Col>

        <Col span={8}>
          <ProFormText
            name="founder"
            label="Founder"
            fieldProps={{
              maxLength: 50,
              showCount: true,
            }}
          />
        </Col>
        <Col span={8}></Col>

        <Col span={8}>
          <ProFormDatePicker
            rules={[
              {
                required: true,
                message: 'please chose established time',
              },
            ]}
            name="establishedTime"
            label="EstablishedTime"
          />
        </Col>
        <Col span={16} />

        <button
          onClick={() => {
            console.log(form.getFieldsValue());
          }}
        >
          xxx
        </button>

        <Col span={16}>
          <ProFormEditor
            name="description"
            label="Description"
            fieldProps={{
              children: <Toolbar />,
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

const Container = styled(ProForm)`
  height: 100%;
  overflow-y: scroll;

  .ant-picker {
    width: 100%;
  }
`;
