import {
  ProFormDraggerUpload,
  ProFormEditor,
  ProFormSelectList,
  ProFormTextNumber,
  Toolbar,
} from '@/components';
import {
  ProForm,
  ProFormDatePicker,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';

export default function Update() {
  const [form] = ProForm.useForm();

  return (
    <Container
      form={form}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      submitter={{
        render(_, dom) {
          return (
            <div className="border-t-[1px] border-t-[#f0f0f0] flex justify-end pt-[20px] space-x-[32px]">
              {dom[0]}
              {dom[1]}
            </div>
          );
        },
      }}
    >
      <Row>
        <Col span={24}>
          <h1 className="mb-[40px] text-center">Update SPU</h1>
        </Col>

        <Col span={8}>
          <ProFormText
            label="Name"
            name="name"
            fieldProps={{ showCount: true, minLength: 1, maxLength: 50 }}
            rules={[
              {
                required: true,
                message: 'please input name',
              },
            ]}
          />
        </Col>
        <Col span={16} />

        <Col span={8}>
          <ProFormTextNumber
            label="Price"
            name="price"
            fieldProps={{
              addonAfter: '$',
              precision: 2,
              max: 99999,
              min: 0,
            }}
          />
        </Col>
        <Col span={16} />

        <Col span={8}>
          <ProFormDraggerUpload
            required
            name="cover"
            label="Cover"
            fieldProps={{ maxCount: 1 }}
          />
        </Col>
        <Col span={16} />

        <Col span={8}>
          <ProFormDatePicker
            label="IssueTime"
            name="issueTime"
            rules={[
              {
                required: true,
                message: 'please chose issueTime',
              },
            ]}
          />
        </Col>
        <Col span={16} />

        <Col span={8}>
          <ProFormSelectList
            keyCode="company"
            name="companyId"
            label="Company/Studio"
          />
        </Col>
        <Col span={16} />

        <Col span={8}>
          <ProFormSelectList
            keyCode="type"
            name="typeIds"
            label="Types"
            mode="multiple"
            rules={[
              {
                required: true,
                message: 'please chose types for spu',
              },
            ]}
          />
        </Col>

        <Col span={8}>
          <ProFormSelectList
            keyCode="tag"
            name="TagIds"
            label="Tags"
            mode="multiple"
            rules={[
              {
                required: true,
                message: 'please chose tags for spu',
              },
            ]}
          />
        </Col>
        <Col span={8} />

        <Col span={8}>
          <ProFormDraggerUpload
            required
            name="carousel"
            label="Carousel"
            fieldProps={{ maxCount: 9 }}
          />
        </Col>
        <Col span={16} />

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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  > .ant-row {
    flex: 1 1 0%;
    height: 0;
    overflow-y: scroll;
  }

  .ant-picker {
    width: 100%;
  }

  .ant-form-item {
    margin-bottom: 40px;
  }

  .ant-input-number {
    width: 100%;
  }

  .ant-input-number-group-wrapper {
    width: 100%;
  }
`;
