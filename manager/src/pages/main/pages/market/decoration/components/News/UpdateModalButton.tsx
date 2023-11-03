import { ProFormTextNumber } from '@/components';
import { updateNews } from '@/libs/api';
import type { UpdateNewsReq } from '@/libs/api/schema';
import {
  ProForm,
  ProFormText,
  type ProFormInstance,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Modal, message } from 'antd';
import React, {
  type CSSProperties,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface IProps {
  type: 'create' | 'edit';
  refresh?: () => void;
  initial?: UpdateNewsReq;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function UpdateModalButton({
  children,
  initial,
  type,
  refresh,
  className,
  style,
}: IProps) {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const formRef = useRef<ProFormInstance<UpdateNewsReq>>();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateNews,
    onSuccess(res) {
      message.success(res.message);
      refresh?.();
      onCancel();
    },
  });

  const onOk = useCallback(() => {
    formRef.current?.validateFields().then((res) => {
      mutate(res);
    });
  }, [mutate]);

  return (
    <>
      <button onClick={onOpen} className={className} style={style}>
        {children}
      </button>
      <Modal
        title={type === 'create' ? 'Create' : 'Edit'}
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        okText="Ok"
        cancelText="Cancel"
        destroyOnClose
        okButtonProps={{
          loading: isLoading,
        }}
        cancelButtonProps={{
          loading: isLoading,
        }}
      >
        <Update type={type} initial={initial} ref={formRef} />
      </Modal>
    </>
  );
}

interface UpdateProps {
  initial?: UpdateNewsReq;
  type: 'create' | 'edit';
}

const Update = forwardRef(({ initial, type }: UpdateProps, ref) => {
  const [form] = ProForm.useForm<UpdateNewsReq>();

  useImperativeHandle(ref, () => form);

  return (
    <ProForm
      form={form}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      initialValues={type === 'create' ? undefined : initial}
      submitter={false}
    >
      <ProFormText name="id" hidden />

      <ProFormText
        label="title"
        name="title"
        fieldProps={{
          maxLength: 50,
          showCount: true,
        }}
        rules={[
          {
            required: true,
            message: 'please input title',
          },
        ]}
      />

      <ProFormTextArea
        label="content"
        name="content"
        fieldProps={{
          maxLength: 500,
          showCount: true,
        }}
      />

      <ProFormTextNumber
        label="sort"
        name="sort"
        fieldProps={{
          precision: 0,
          min: 0,
          max: 10000,
        }}
        rules={[
          {
            required: true,
            message: 'please input sort',
          },
        ]}
      />
    </ProForm>
  );
});
