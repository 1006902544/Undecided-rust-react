import { ProFormDraggerUpload, ProFormEditor, Toolbar } from '@/components';
import type { UpdateCompanyStudioReq } from '@/libs/api/schema';
import { useGetCompanyDetail, updateCompany } from '@/libs/api';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Col, Row, Spin } from 'antd';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import qs from 'query-string';

interface FinishParams extends UpdateCompanyStudioReq {
  logo: (File & {
    response: { data: { etag: string; fileName: string; url: string } };
  })[];
  establishedTime?: string;
}

export default function Update() {
  const [form] = ProForm.useForm<FinishParams>();
  const navigate = useNavigate();

  const onFinish = async (v: FinishParams) => {
    const params = {
      ...v,
      logo_url: v.logo[0]?.response.data.url,
      logo_name: v.logo[0]?.response.data.fileName,
      e_tag: v.logo[0]?.response.data.etag,
      established_time: v.establishedTime as string,
    };
    delete (params as any).logo;
    delete params.establishedTime;
    if (id) {
      params.id = id;
    }
    await updateCompany(params);
    navigate(-1);
  };

  //edit
  const { search } = useLocation();
  const id = useMemo(() => {
    const { id } = qs.parse(search);
    return id ? Number(id) : undefined;
  }, [search]);

  const { isLoading } = useGetCompanyDetail(
    { id: id! },
    {
      query: {
        enabled: !!id,
        onSuccess({ data }) {
          const params: Record<string, any> = { ...data };
          params.logo = [
            {
              response: {
                data: {
                  fileName: params.logo_name,
                  url: params.logo_url,
                  etag: params.e_tag,
                },
              },
              status: 'done',
            },
          ];
          params.establishedTime = params.established_time;
          form.setFieldsValue(params);
        },
      },
    }
  );

  const goBack = () => {
    navigate(-1);
  };

  return isLoading && !!id ? (
    <Spin spinning size="large" />
  ) : (
    <Container
      onFinish={onFinish as any}
      form={form}
      scrollToFirstError
      submitter={{
        render(_, dom) {
          return (
            <div className="gap-8 flex justify-end flex-shrink-0 border-t-[1px] border-[rgb(255, 255, 255)] pt-[20px]">
              <Button onClick={goBack}>cancel</Button>
              {dom[0]}
              {dom[1]}
            </div>
          );
        },
      }}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
    >
      <div className="flex-1 overflow-y-scroll mb-[16px] pb-[16px] scroll-smooth ">
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
            <ProFormText
              label="Region"
              name="region"
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
            <ProFormDateTimePicker
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
