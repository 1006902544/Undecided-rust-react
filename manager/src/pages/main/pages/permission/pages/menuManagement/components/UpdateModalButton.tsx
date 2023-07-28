import { Button, InputNumber, Modal } from 'antd';
import React, {
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
} from 'react';
import type { ModalProps, ButtonProps } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import type { UpdateRouteReq } from '@/libs/api/schema';
import { PriRoute, useMenuManagementContext } from '../menuManagement';
import { updateRouter } from '@/libs/api';
import { useMenuContext } from '@/components';

interface IProps extends ButtonProps {
  modalProps?: ModalProps;
  record?: PriRoute;
  parentRecord?: PriRoute;
  childNode?: React.ReactNode;
}

export default function UpdateModalButton({
  modalProps,
  children,
  record,
  parentRecord,
  childNode,
  ...buttonProps
}: IProps) {
  const menuContext = useMenuContext();

  const [open, setOpen] = useState(false);
  const onCancel = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
  };
  //refresh menu list after submitting
  const { refetch } = useMenuManagementContext() ?? {};

  //submit fn
  const mutationFn = async () => {
    const isRoot = !parentRecord;
    const isCreate = !record;

    let params: UpdateRouteReq = {} as UpdateRouteReq;
    await formRef.current?.validateFields().then((res) => {
      params = res;
    });
    if (!isCreate) {
      params.key = record.key;
    } else {
      params.p_key = parentRecord?.key;
    }
    if (!isRoot) {
      params.p_key = parentRecord?.key;
      params.path = parentRecord.path + params.key;
    }
    return updateRouter(params);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: mutationFn,
    onSuccess() {
      onCancel();
      refetch?.();
      menuContext?.refetch();
    },
  });

  //get formInstance for submitting
  const formRef = useRef<ProFormInstance<UpdateRouteReq>>();

  const title = useMemo(() => {
    if (record) {
      const baseStr = 'Edit';
      return baseStr;
    } else {
      const baseStr = parentRecord
        ? `Create Router For ${parentRecord.label}`
        : 'Create Root Router';
      return baseStr;
    }
  }, [record, parentRecord]);

  return (
    <>
      <div onClick={onOpen} className=" inline-block">
        {childNode ?? (
          <Button type="primary" {...buttonProps}>
            {children}
          </Button>
        )}
      </div>
      <Modal
        open={open}
        destroyOnClose
        onCancel={onCancel}
        onOk={() => mutate()}
        title={title}
        okButtonProps={{
          loading: isLoading,
        }}
        {...modalProps}
      >
        <UpdateBody record={record} ref={formRef} />
      </Modal>
    </>
  );
}

interface UpdateBodyProps {
  record?: PriRoute;
}

const UpdateBody = forwardRef(({ record }: UpdateBodyProps, ref) => {
  const [form] = ProForm.useForm();

  useImperativeHandle(ref, () => form);

  return (
    <ProForm
      form={form}
      submitter={false}
      initialValues={{ sort: 0, ...record }}
    >
      <ProFormText
        name="label"
        label="Label"
        rules={[
          {
            required: true,
            message: 'please input label',
          },
        ]}
      />

      <ProFormText
        name="path"
        label="Path"
        rules={[
          {
            required: true,
            message: 'please input path',
          },
        ]}
      />

      <ProForm.Item
        name="sort"
        label="Sort"
        rules={[
          {
            required: true,
            message: 'please input sort',
          },
        ]}
      >
        <InputNumber precision={0} min={0} />
      </ProForm.Item>
    </ProForm>
  );
});
