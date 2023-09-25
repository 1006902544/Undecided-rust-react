import { ProForm, ProFormText } from '@ant-design/pro-components';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CaptchaWithButtonFormItem } from '../components';
import { Button, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { managerSignup } from '@/libs/api';
import type { ManagerSignupAccount } from '@/libs/api/schema';

interface SignUpForm extends ManagerSignupAccount {
  ensurePassword: string;
}

export default function SignUp({
  setActiveKey,
}: {
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [form] = ProForm.useForm<SignUpForm>();

  const { mutate, isLoading } = useMutation({
    mutationFn: managerSignup,
    onSuccess() {
      message.success('SignUp success');
      setActiveKey('signIn');
    },
  });

  const onFinish = useCallback(
    async (v: SignUpForm) => {
      mutate(v);
    },
    [mutate]
  );

  return (
    <Container className="ml-[774px] w-[360px] mt-[50px]">
      <ProForm
        onFinish={onFinish}
        form={form}
        submitter={{
          render() {
            return (
              <div className="flex justify-center">
                <Button
                  type="primary"
                  className="w-[150px]"
                  loading={isLoading}
                  htmlType="submit"
                >
                  SignUp
                </Button>
              </div>
            );
          },
        }}
      >
        <ProFormText
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please enter 6 to 18 digits',
              min: 6,
              max: 18,
            },
          ]}
        />

        <ProFormText
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              pattern:
                /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: 'Please enter an email in the correct format',
            },
          ]}
        />

        <CaptchaWithButtonFormItem
          label="Captcha"
          name="captcha"
          onSuccess={(data) => {
            if (data.is_manager) {
              message.error('This email had been signed up');
            }
          }}
        />

        <ProFormText
          label="Password"
          name="password"
          fieldProps={{
            type: 'password',
          }}
          rules={[
            {
              required: true,
              message: 'Please enter 6 to 18 digits',
              min: 6,
              max: 18,
            },
          ]}
        />

        <ProFormText
          label="EnsurePassword"
          name="ensurePassword"
          fieldProps={{
            type: 'password',
          }}
          rules={[
            {
              required: true,
              message: 'must same to password',
              min: 6,
              max: 18,
              validator(_, v) {
                if (v !== form.getFieldValue('password')) {
                  return Promise.reject();
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        />
      </ProForm>
    </Container>
  );
}

const Container = styled.div`
  .ant-form-item {
    margin-bottom: 32px;
  }
`;
