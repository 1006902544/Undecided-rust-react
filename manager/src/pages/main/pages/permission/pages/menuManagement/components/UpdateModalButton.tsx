import { Button, InputNumber, Modal, Tooltip } from 'antd';
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
import styled from 'styled-components';

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

    let params: Record<string, any> = {};
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
    }
    return updateRouter(params as UpdateRouteReq);
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
        <UpdateBody record={record} ref={formRef} parentRecord={parentRecord} />
      </Modal>
    </>
  );
}

interface UpdateBodyProps {
  record?: PriRoute;
  parentRecord?: PriRoute;
}

const UpdateBody = forwardRef(
  ({ record, parentRecord }: UpdateBodyProps, ref) => {
    const [form] = ProForm.useForm();

    useImperativeHandle(ref, () => form);

    return (
      <Container
        form={form}
        submitter={false}
        initialValues={{
          sort: 0,

          ...record,
          path: record ? record.path : parentRecord?.path,
        }}
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
      </Container>
    );
  }
);

const Container = styled(ProForm)`
  .parent-path-input-container {
    background-color: transparent;
    border: 0;
    box-shadow: none;
    padding: 0;

    * {
      border: 0;
      box-shadow: none;
      background-color: transparent;
    }
  }
`;
