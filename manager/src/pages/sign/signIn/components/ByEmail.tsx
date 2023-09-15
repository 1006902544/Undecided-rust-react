import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CaptchaWithButtonFormItem } from '../../components';
import { useMutation } from '@tanstack/react-query';
import { managersSignIn } from '@/libs/api';
import type { ManagerSignIn } from '@/libs/api/schema';
import { setToken } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function ByEmail() {
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
        onFinish={onFinish}
        form={form}
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

        <CaptchaWithButtonFormItem label="Captcha" name="captcha" />
      </ProForm>
    </Container>
  );
}

const Container = styled.div`
  .ant-form-item {
    margin-bottom: 32px;
  }
`;
