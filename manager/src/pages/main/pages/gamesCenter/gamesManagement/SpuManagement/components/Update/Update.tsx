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
import { Button, Col, Row, message } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { updateSpu } from '@/libs/api';
import type { UpdateSpuReq } from '@/libs/api/schema';
import type { FormFinish } from './Update.d';
import { useNavigate } from 'react-router-dom';

export default function Update() {
  const [form] = ProForm.useForm<FormFinish>();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: UpdateSpuReq) => {
      return updateSpu(data);
    },
    onSuccess(res) {
      message.success(res.message);
      navigate(-1);
    },
  });

  const onFinish = useCallback(async (formData: FormFinish) => {
    const cover = {
      name: formData.cover[0].response?.data.fileName!,
      url: formData.cover[0].response?.data.url!,
    };
    const curParams: UpdateSpuReq = {
      name: formData.name,
      price: formData.price,
      cover,
      issue_time: formData.issueTime,
      company_id: formData.companyId,
      type_ids: formData.typeIds,
      tag_ids: formData.tagIds,
      carousel: formData.carousel.map((item) => ({
        name: item.response?.data.fileName!,
        url: item.response?.data.url!,
      })),
      description: formData.description,
    };
    mutate(curParams);
  }, []);

  return (
    <Container
      form={form}
      onFinish={onFinish as any}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      submitter={{
        render(_, dom) {
          return (
            <div className="border-t-[1px] border-t-[#f0f0f0] flex justify-end pt-[20px] space-x-[32px]">
              <Button loading={isLoading}>Cancel</Button>
              <Button htmlType="reset" loading={isLoading}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Submit
              </Button>
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
            name="tagIds"
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
