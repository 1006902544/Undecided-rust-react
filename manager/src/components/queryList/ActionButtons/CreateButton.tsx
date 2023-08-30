import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useListContext } from '../hooks';
import {
  type ButtonProps,
  type ModalProps,
  Button,
  Modal,
  message,
} from 'antd';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import type { ProFormProps } from '@ant-design/pro-components';
import { Resource } from '../types.d';

interface IProps extends ButtonProps {
  children?: React.ReactNode;
  modalProps?: ModalProps;
  formProps?: ProFormProps;
  label?: string;
  meta?: Record<string, any>;
}

export default function CreateButton({
  children,
  modalProps,
  label,
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
              resource?.create?.({ ...meta, ...res }).then(() => {
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
          meta={meta}
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
  meta?: Record<string, any>;
}

const UpdateBody = forwardRef(
  ({ children, formProps, meta }: UpdateBodyProps, ref) => {
    const [form] = ProForm.useForm();

    //share form with modal for submitting
    useImperativeHandle(ref, () => form);

    //query when setup

    return (
      <ProForm
        form={form}
        submitter={false}
        initialValues={meta}
        {...formProps}
      >
        {children}
      </ProForm>
    );
  }
);
