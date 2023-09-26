import { ProFormTextNumber } from '@/components';
import { useAuthStore } from '@/libs/store';
import { Avatar } from '@/pages/main/components';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { SubmitterProps } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Roles, UploadAvatarModalButton } from './components';
import { useMutation } from '@tanstack/react-query';
import { updateManagerInfo } from '@/libs/api';
import type { ManagerInfoUpdate } from '@/libs/api/schema';

export default function Self() {
  const { auth, getAuth } = useAuthStore();

  //auth info
  const [form] = ProForm.useForm();

  const [editing, setEditing] = useState(false);

  const handleEditing = useCallback(() => {
    setEditing((editing) => !editing);
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: updateManagerInfo,
    onSuccess({ message: msg }) {
      setEditing(false);
      message.success(msg);
      getAuth();
    },
  });

  const submit = useCallback(
    async (data: ManagerInfoUpdate) => {
      mutate(data);
    },
    [mutate]
  );

  const submitter = useMemo<SubmitterProps>(
    () => ({
      render() {
        return (
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleEditing}
              htmlType="reset"
              loading={isLoading}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>

            {editing && (
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Submit
              </Button>
            )}
          </div>
        );
      },
    }),
    [editing, handleEditing, isLoading]
  );

  //role apply
  const [open, setOpen] = useState(false);

  const changeOpen = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return (
    <Container>
      <div className="flex justify-center items-end shadow-lg py-[10px]">
        <UploadAvatarModalButton>
          <Avatar auth={auth} size="large" />
        </UploadAvatarModalButton>

        <h2 className="ml-[15px]">{auth?.name}</h2>
        <span className="ml-[8px] text-[14px]">#{auth?.id}</span>
      </div>

      <div className="flex justify-center mt-[32px]">
        <div className="flex justify-center space-x-4 w-[800px]">
          <ProForm
            initialValues={auth || undefined}
            form={form}
            layout="horizontal"
            labelCol={{ flex: '100px' }}
            submitter={submitter}
            onFinish={submit}
          >
            <button
              type="button"
              className=" z-10 absolute right-[-20px] rounded-[4px] shadow-lg top-[20px] block w-[100px] h-[20px] bg-[blue] text-[white] text-center leading-[20px]"
              onClick={changeOpen}
            >
              roles
            </button>

            <ProFormText hidden name="name" />
            <ProFormText label="RoleName" name="role_name" readonly />
            <ProFormText label="Username" name="username" readonly />
            <ProFormText label="Email" name="email" readonly />
            <ProFormText
              label="Mobile"
              name="mobile"
              readonly={!editing}
              required={false}
              rules={[
                {
                  pattern: /^(?:(?:\+|00)86)?1\d{10}$/,
                  message: 'please input right mobile number',
                  required: true,
                },
              ]}
            />

            <ProFormTextNumber
              label="Age"
              name="age"
              readonly={!editing}
              fieldProps={{
                min: 0,
                max: 200,
                precision: 0,
              }}
            />
            <ProFormSelect
              label="Gender"
              name="gender"
              readonly={!editing}
              allowClear={false}
              options={[
                {
                  label: 'Unknown',
                  value: 0,
                },
                {
                  label: 'Male',
                  value: 1,
                },
                {
                  label: 'Female',
                  value: 2,
                },
              ]}
            />
          </ProForm>

          <div className={open ? 'role-apply-open' : 'role-apply-close'}>
            <h2 className="p-[20px]">Roles</h2>
            <Roles />
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .ant-form {
    box-shadow: 3px 3px 5px 0 #ccc;
    padding: 20px;
    flex: 1;
    transition: all 0.2s;
    position: relative;
    width: 400px;
    flex-shrink: 0;
  }

  div[class^='role-apply'] {
    overflow: hidden;
    transition: all 0.2s;
    box-shadow: 3px 3px 5px 0 #ccc;
    flex-shrink: 0;
  }

  .role-apply-open {
    flex: 1;
  }
  .role-apply-close {
    flex: 0;
  }
`;
