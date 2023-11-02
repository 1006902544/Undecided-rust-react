import { ProFormDraggerUpload, ProFormTextNumber } from '@/components';
import type { ResponseData } from '@/components/DraggerUpload/ProFormDraggerUpload';
import { updateCarousel } from '@/libs/api';
import { UpdateCarouselReq } from '@/libs/api/schema';
import {
  ProForm,
  type ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Modal, UploadFile, message } from 'antd';
import React, {
  type HTMLAttributes,
  useCallback,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import styled from 'styled-components';

interface IProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children?: React.ReactNode;
  type: 'create' | 'edit';
  onSuccess?: () => void;
  initial?: UpdateCarouselReq;
}

export default function UpdateModalButton({
  children,
  type,
  className: classNameProp,
  onSuccess,
  initial,
  ...props
}: IProps) {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const className = useMemo(
    () => `inline-block ${classNameProp ? classNameProp : ''}`,
    [classNameProp]
  );

  //表单提交相关
  const formRef = useRef<ProFormInstance<FormInstanceValue>>(null);
  const { mutate, isLoading } = useMutation({
    mutationFn: updateCarousel,
    onSuccess(res) {
      message.success(res.message);
      onCancel();
      onSuccess?.();
    },
  });

  const onOk = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    form.validateFields().then((res) => {
      const response = res.cover_url.at(0)?.response;
      mutate({
        ...res,
        cover_url: response?.data?.url!,
        id: initial?.id,
      });
    });
  }, [initial?.id, mutate]);

  return (
    <>
      <div className={className} onClick={onOpen} {...props}>
        {children}
      </div>
      <Modal
        width={800}
        open={open}
        destroyOnClose
        onCancel={onCancel}
        title={type === 'create' ? 'Create' : 'Edit'}
        okButtonProps={{
          loading: isLoading,
        }}
        cancelButtonProps={{
          loading: isLoading,
        }}
        onOk={onOk}
      >
        <Update ref={formRef} initial={initial} type={type} />
      </Modal>
    </>
  );
}

interface FormInstanceValue extends Omit<UpdateCarouselReq, 'cover_url'> {
  cover_url: Array<UploadFile<{ data: ResponseData }>>;
}

const Update = forwardRef(
  (
    { initial, type }: { initial?: UpdateCarouselReq; type: 'create' | 'edit' },
    ref
  ) => {
    const [form] = ProForm.useForm<FormInstanceValue>();
    useImperativeHandle(ref, () => form);

    return (
      <Container
        form={form}
        submitter={false}
        layout="horizontal"
        labelCol={{ flex: '120px' }}
        initialValues={
          type === 'edit'
            ? {
                ...initial,
                cover_url: [
                  {
                    status: 'done',
                    url: initial?.cover_url,
                    name: initial?.cover_url,
                    response: {
                      data: {
                        fileName: initial?.cover_url,
                        url: initial?.cover_url,
                      },
                    },
                  },
                ],
              }
            : undefined
        }
      >
        <ProFormText
          label="title"
          name="title"
          rules={[
            {
              required: true,
              message: 'please input title',
            },
          ]}
          fieldProps={{
            maxLength: 50,
            minLength: 1,
            showCount: true,
          }}
        />

        <ProFormDraggerUpload
          name="cover_url"
          label="cover"
          fieldProps={{
            maxCount: 1,
          }}
          rules={[
            {
              required: true,
              validator(_, value) {
                if (value && value.at(0)?.status === 'done') {
                  return Promise.resolve();
                } else {
                  return Promise.reject();
                }
              },
              message: 'please chose cover',
            },
          ]}
        />

        <ProFormText
          label="subtitle"
          name="subtitle"
          fieldProps={{
            maxLength: 100,
            showCount: true,
          }}
        />

        <ProFormTextNumber
          name="sort"
          label="sort"
          rules={[
            {
              required: true,
              message: 'please input sort',
            },
          ]}
          fieldProps={{
            min: 0,
            max: 1000,
            precision: 0,
          }}
        />

        <ProFormText
          name="link_url"
          label="link"
          fieldProps={{
            maxLength: 500,
            showCount: true,
          }}
        />

        <ProFormTextArea
          name="content"
          label="content"
          fieldProps={{
            maxLength: 500,
            showCount: true,
          }}
        />
      </Container>
    );
  }
);

const Container = styled(ProForm)`
  margin-top: 24px;

  .ant-form-item {
    margin-bottom: 32px;
  }
`;
