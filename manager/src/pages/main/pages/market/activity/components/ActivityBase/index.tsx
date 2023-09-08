import { ProFormDraggerUpload, ProFormEditor, Toolbar } from '@/components';
import { updateActivityBase } from '@/libs/api';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button, Col, Row, message } from 'antd';
import styled from 'styled-components';
import { useUpdateContext } from '../UpdateContext';
import { useCallback, useMemo } from 'react';
import type { ActivityBaseFormItem } from './index.d';
import { useNavigate } from 'react-router-dom';

export default function ActivityBase() {
  const [form] = ProForm.useForm<ActivityBaseFormItem>();
  const { id, data, isEdit, setStep, refetchDetail } = useUpdateContext();
  const navigate = useNavigate();

  //initial
  const initialValue = useMemo(() => {
    if (isEdit && data?.base) {
      return {
        ...data.base,
        cover: [
          {
            name: data.base.cover_name,
            url: data.base.cover_url,
            status: 'done',
            response: {
              data: {
                fileName: data.base.cover_name,
                url: data.base.cover_url,
              },
            },
          },
        ],
      };
    } else {
      return {};
    }
  }, [isEdit, data]);

  //upload
  const { mutate, isLoading } = useMutation({
    mutationFn: updateActivityBase,
    onSuccess({ data: id }) {
      message.success('Update success');
      if (isEdit) {
        refetchDetail?.();
        setStep(1);
      } else {
        navigate(`/market/activity/edit?id=${id}`);
      }
    },
  });

  const onFinish = useCallback(
    async (data: ActivityBaseFormItem) => {
      const params = {
        ...data,
        cover_url: data.cover[0].response.data.url,
        cover_name: data.cover[0].response.data.fileName,
        id,
      };
      mutate(params);
    },
    [mutate, id]
  );

  return (
    <Container className="flex justify-center">
      <ProForm
        labelCol={{ flex: '100px' }}
        layout="horizontal"
        form={form}
        initialValues={initialValue}
        onFinish={onFinish}
        submitter={{
          render() {
            return (
              <div className="flex justify-center space-x-8">
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
        <header className="text-center mb-[32px]">
          <h1>Input Activity Basic</h1>
        </header>

        <Row>
          <Col span={12}>
            <ProFormText
              label="Title"
              name="title"
              rules={[
                { required: true, message: 'please input activity title' },
              ]}
              fieldProps={{
                showCount: true,
                minLength: 1,
                maxLength: 50,
              }}
            />
          </Col>

          <Col span={12}>
            <ProFormText
              label="Subtitle"
              name="subtitle"
              rules={[
                { required: true, message: 'please input activity subtitle' },
              ]}
              fieldProps={{
                showCount: true,
                minLength: 1,
                maxLength: 100,
              }}
            />
          </Col>

          <Col span={12}>
            <ProFormDraggerUpload
              label="Cover"
              name="cover"
              fieldProps={{
                maxCount: 1,
              }}
              rules={[
                { required: true, message: 'please upload activity cover' },
              ]}
            />
          </Col>

          <Col span={12} />

          <Col span={12}>
            <ProFormSelect
              label="ActivityType"
              name="activity_type"
              readonly={isEdit}
              rules={[
                { required: true, message: 'please chose activity type' },
              ]}
              options={[
                {
                  label: 'bundle',
                  value: 'bundle',
                },
                {
                  label: 'promotion',
                  value: 'promotion',
                },
              ]}
            />
          </Col>

          <Col span={24}>
            <ProFormEditor
              label="Content"
              name="content"
              rules={[
                { required: true, message: 'please input activity content' },
              ]}
              fieldProps={{
                children: <Toolbar />,
              }}
            />
          </Col>
        </Row>
      </ProForm>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  .ant-form {
    width: 1000px;
  }
`;
