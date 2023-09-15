import { ProForm, ProFormText } from '@ant-design/pro-components';
import React from 'react';
import styled from 'styled-components';
import { CaptchaWithButtonFormItem } from '../components';
import { Button } from 'antd';

export default function SignUp() {
  const [form] = ProForm.useForm();

  return (
    <Container className="ml-[774px] w-[360px] mt-[50px]">
      <ProForm
        form={form}
        submitter={{
          render() {
            return (
              <div className="flex justify-center">
                <Button type="primary" className="w-[150px]">
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

        <CaptchaWithButtonFormItem label="Captcha" name="captcha" />

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
