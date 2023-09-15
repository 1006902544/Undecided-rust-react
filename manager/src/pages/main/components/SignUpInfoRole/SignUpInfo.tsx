import { ProFormTextNumber } from '@/components';
import { updateManagerInfo } from '@/libs/api';
import { useAuthStore } from '@/libs/store';
import { setToken } from '@/utils';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import React, { useCallback } from 'react';

export default function SignUpInfo() {
  const [form] = ProForm.useForm();
  const { auth, getAuth } = useAuthStore((s) => s);

  const { mutate: authMutate } = useMutation({
    mutationFn: getAuth,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateManagerInfo,
    onSuccess({ data: token }) {
      setToken(token);
      authMutate();
    },
  });

  const onFinish = useCallback(
    async (v: any) => {
      const data = {
        ...v,
        id: auth?.id,
        username: auth?.username,
        email: auth?.email,
      };
      mutate(data);
    },
    [auth, mutate]
  );

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      submitter={{
        render() {
          return (
            <div className="flex justify-center w-full">
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Submit
              </Button>
            </div>
          );
        },
      }}
    >
      <ProFormText
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'please input name',
          },
        ]}
        fieldProps={{
          minLength: 1,
          maxLength: 50,
          showCount: true,
        }}
      />
      <ProFormTextNumber
        label="Age"
        name="age"
        fieldProps={{
          min: 0,
          max: 200,
          precision: 0,
        }}
      />
      <ProFormSelect
        label="Gender"
        name="gender"
        options={[
          { label: 'Unknown', value: 0 },
          { label: 'Male', value: 1 },
          { label: 'Female', value: 2 },
        ]}
      />
      <ProFormText
        label="Mobile"
        name="mobile"
        rules={[
          {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
            message: 'please input right mobile',
          },
        ]}
      />
    </ProForm>
  );
}
