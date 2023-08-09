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
  label?: string;
  data?: Record<string, any>;
  meta?: Record<string, any>;
  formProps?: ProFormProps;
}

export default function UpdateButton({
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
      <Button type="link" {...btnProps} onClick={onOpen}>
        {label ?? 'EDIT'}
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
              resource?.update?.({ ...res, ...meta }).then(() => {
                onCancel();
                message.success('edit success');
                listContext?.refetch();
              });
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        title="Edit"
        okButtonProps={{
          loading: submitting,
        }}
        {...modalProps}
      >
        <UpdateBody
          data={data}
          resource={resource}
          ref={containerRef}
          formProps={formProps}
        >
          {children}
        </UpdateBody>
      </Modal>
    </>
  );
}

interface UpdateBodyProps {
  resource: Resource<Record<string, any>, any>;
  children?: React.ReactNode;
  data?: Record<string, any>;
  formProps?: ProFormProps;
}

const UpdateBody = forwardRef(
  (
    { resource, data: dataProps, children, formProps }: UpdateBodyProps,
    ref
  ) => {
    const [form] = ProForm.useForm();

    //share form with modal for submitting
    useImperativeHandle(ref, () => form);

    //query when setup
    const { isLoading, data } = useQuery({
      queryKey: [`${resource.name}-check`],
      queryFn: async () => (await resource.check?.(dataProps)) ?? {},
      onSuccess(data) {
        form.setFieldsValue(data);
      },
    });

    return (
      <Spin spinning={isLoading}>
        <ProForm form={form} submitter={false} {...formProps}>
          {children}
        </ProForm>
      </Spin>
    );
  }
);
