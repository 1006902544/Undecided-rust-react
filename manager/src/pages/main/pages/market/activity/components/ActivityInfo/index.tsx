import { ProFormTextNumber } from '@/components';
import { updateActivityInfo } from '@/libs/api';
import {
  ProForm,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button, Col, Row, message } from 'antd';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useUpdateContext } from '../UpdateContext';
import type { ActivityInfoFormItem } from './index.d';

export default function ActivityInfo() {
  const [form] = ProForm.useForm<ActivityInfoFormItem>();
  const { data, id, setStep, refetchDetail } = useUpdateContext();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateActivityInfo,
    onSuccess() {
      message.success('Update success');
      refetchDetail?.();
      setStep(2);
    },
  });

  const activityType = useMemo(() => {
    return data?.base.activity_type;
  }, [data]);

  const onFinish = useCallback(
    async (values: ActivityInfoFormItem) => {
      if (id) {
        mutate({
          ...values,
          start_time: values.time[0],
          end_time: values.time[1],
          id,
        });
      }
    },
    [id, mutate]
  );

  const initialValues = useMemo(() => {
    if (data?.info) {
      return {
        ...data.info,
        time: [data.info.start_time, data.info.end_time],
      };
    } else {
      return {};
    }
  }, [data]);

  return (
    <Container className="flex justify-center">
      <ProForm
        labelCol={{ flex: '100px' }}
        onFinish={onFinish}
        layout="horizontal"
        initialValues={initialValues}
        form={form}
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
          <h1>Input Activity Info</h1>
        </header>

        <Row>
          <Col span={12}>
            <ProFormTextNumber
              name={activityType === 'bundle' ? 'price' : 'discount'}
              label={activityType === 'bundle' ? 'Price' : 'Discount'}
              rules={[
                {
                  required: true,
                  message: `please input activity ${
                    activityType === 'bundle' ? 'price' : 'discount'
                  }`,
                },
              ]}
              fieldProps={{
                min: activityType === 'bundle' ? 0.01 : 0.0,
                max: activityType === 'bundle' ? 9999.99 : 9.9,
                precision: activityType === 'bundle' ? 2 : 1,
              }}
            />
          </Col>

          <Col span={12} />

          <Col span={12}>
            <ProFormSelect
              label="PublishType"
              name="publish_type"
              options={[
                {
                  label: 'Manual',
                  value: 'manual',
                },
                {
                  label: 'Auto',
                  value: 'auto',
                },
              ]}
              rules={[{ required: true, message: 'please chose publish type' }]}
            />
          </Col>

          <Col span={12} />

          <ProForm.Item
            shouldUpdate={(pre, cur) => pre.publish_type !== cur.publish_type}
            noStyle
          >
            {({ getFieldValue }) =>
              getFieldValue('publish_type') === 'auto' ? (
                <Col span={24}>
                  <ProFormDateTimePicker
                    label="PublishTime"
                    name="publish_time"
                    rules={[
                      {
                        required: true,
                        message:
                          'please input publish time or check to manual publish',
                      },
                    ]}
                  />
                </Col>
              ) : null
            }
          </ProForm.Item>

          <Col span={24}>
            <ProFormDateTimeRangePicker label="Time" name="time" />
          </Col>
        </Row>
      </ProForm>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  .ant-form {
    width: 600px;
  }
`;
