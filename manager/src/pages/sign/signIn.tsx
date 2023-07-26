import React from 'react';
import { Modal } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import type { LoginBody } from '@/libs/api/schema';
import { signIn } from '@/libs/api';
import { setToken } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const [form] = ProForm.useForm<LoginBody>();

  const sign_in = async (params: LoginBody) => {
    const { data: token } = await signIn(params);
    setToken(token);
    navigate('/');
  };

  return (
    <div>
      <Modal open closable={false} footer={false}>
        <ProForm form={form} onFinish={sign_in}>
          <ProFormText
            label="username"
            name="username"
            rules={[
              { required: true, message: 'please input username' },
              {
                min: 6,
                max: 16,
                message: 'username`s length is restricted in 6 - 18',
              },
            ]}
          />
          <ProFormText
            label="password"
            name="password"
            fieldProps={{
              type: 'password',
            }}
            rules={[
              { required: true, message: 'please input password' },
              {
                min: 6,
                max: 16,
                message: 'password`s length is restricted in 6 - 18',
              },
            ]}
          />
        </ProForm>
      </Modal>
    </div>
  );
}
