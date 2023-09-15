import { managersSignIn } from '@/libs/api';
import type { ManagerSignIn } from '@/libs/api/schema';
import { setToken } from '@/utils';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button, message } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function ByPassword() {
  const [form] = ProForm.useForm();

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: managersSignIn,
    onSuccess({ data: token }) {
      setToken(token);
      message.success('SignIn success');
      navigate('/');
    },
  });

  const onFinish = useCallback(
    async (data: ManagerSignIn) => {
      mutate(data);
    },
    [mutate]
  );

  return (
    <Container className="w-[360px]">
      <ProForm
        form={form}
        onFinish={onFinish}
        submitter={{
          render() {
            return (
              <div className="flex justify-center">
                <Button
                  type="primary"
                  className="w-[150px]"
                  htmlType="submit"
                  loading={isLoading}
                >
                  SignIn
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
          label="Password"
          name="password"
          fieldProps={{
            type: 'password',
          }}
          rules={[
            {
              required: true,
              message: 'Please enter 6 to 18 password',
              min: 6,
              max: 18,
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
