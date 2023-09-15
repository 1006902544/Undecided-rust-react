import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

export default function ByPassword() {
  const [form] = ProForm.useForm();

  return (
    <Container className="w-[360px]">
      <ProForm
        form={form}
        submitter={{
          render() {
            return (
              <div className="flex justify-center">
                <Button type="primary" className="w-[150px]">
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
