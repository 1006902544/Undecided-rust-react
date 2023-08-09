import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useListContext } from '../hooks';
import {
  Spin,
  type ButtonProps,
  type ModalProps,
  Button,
  Modal,
  message,
} from 'antd';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import type { ProFormProps } from '@ant-design/pro-components';
import { Resource } from '../types.d';
import { useQuery } from '@tanstack/react-query';

interface IProps extends ButtonProps {
  children?: React.ReactNode;
  modalProps?: ModalProps;
  formProps?: ProFormProps;
  label?: string;
  data?: Record<string, any>;
  meta?: Record<string, any>;
}

export default function CreateButton({
  children,
  modalProps,
  label,
  data,
  meta,
  formProps,
  ...btnProps
}: IProps) {
  const listContext = useListContext();

  const containerRef = useRef<ProFormInstance>();

  //handle modal open
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onCancel = () => {
    setOpen(false);
  };

  //is submitting
  const [submitting, setSubmitting] = useState(false);

  if (!listContext)
    return <span>This component must be setup in listContext</span>;

  const { resource } = listContext;

  return (
    <>
      <Button type="primary" {...btnProps} onClick={onOpen}>
        {label ?? 'CREATE'}
      </Button>
      <Modal
        open={open}
        onCancel={onCancel}
        destroyOnClose={true}
        onOk={() => {
          setSubmitting(true);
          containerRef?.current
            ?.validateFields()
            .then((res) => {
              resource?.create?.({ ...res, ...meta }).then(() => {
                onCancel();
                message.success('create success');
                listContext?.refetch();
              });
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        title="Create"
        okButtonProps={{
          loading: submitting,
        }}
        {...modalProps}
      >
        <UpdateBody
          data={data}
          formProps={formProps}
          resource={resource}
          ref={containerRef}
        >
          {children}
        </UpdateBody>
      </Modal>
    </>
  );
}

interface UpdateBodyProps {
  resource: Resource<Record<string, any>, any>;
  formProps?: ProFormProps;
  children?: React.ReactNode;
  data?: Record<string, any>;
}

const UpdateBody = forwardRef(
  ({ children, formProps }: UpdateBodyProps, ref) => {
    const [form] = ProForm.useForm();

    //share form with modal for submitting
    useImperativeHandle(ref, () => form);

    //query when setup

    return (
      <ProForm form={form} submitter={false} {...formProps}>
        {children}
      </ProForm>
    );
  }
);
