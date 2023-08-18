import { ProFormDraggerUpload, ProFormEditor, Toolbar } from '@/components';
import type { UpdateCompanyStudioReq } from '@/libs/api/schema';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function Update() {
  const [form] = ProForm.useForm<UpdateCompanyStudioReq>();
  const navigate = useNavigate();

  const onFinish = async (v: UpdateCompanyStudioReq) => {
    console.log(v);
  };

  return (
    <Container
      onFinish={onFinish as any}
      form={form}
      scrollToFirstError
      submitter={{
        render(_, dom) {
          return (
            <div className="gap-8 flex justify-end flex-shrink-0 border-t-[1px] border-[rgb(255, 255, 255)] pt-[20px]">
              {dom[0]}
              {dom[1]}
            </div>
          );
        },
      }}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
    >
      <div className="flex-1 overflow-y-scroll mb-[16px] pb-[16px] scroll-smooth">
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
              required
              fieldProps={{
                maxCount: 1,
              }}
            />
          </Col>
          <Col span={16} />

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
      </div>
    </Container>
  );
}

const Container = styled(ProForm)`
  display: flex;
  height: 100%;
  flex-direction: column;

  .ant-picker {
    width: 100%;
  }
`;
