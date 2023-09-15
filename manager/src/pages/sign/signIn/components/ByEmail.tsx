import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { CaptchaWithButtonFormItem } from '../../components';

export default function ByEmail() {
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
