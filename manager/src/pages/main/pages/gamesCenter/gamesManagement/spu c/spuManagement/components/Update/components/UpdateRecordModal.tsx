import { ProFormEditor, Toolbar } from '@/components';
import { updateSpuUpdateRecord } from '@/libs/api';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Modal } from 'antd';
import type { FormInstance } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';

interface IProps {
  open: boolean;
  spuId?: string;
  onCancel: () => void;
  onOk: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateRecord({
  open,
  spuId,
  setOpen,
  onCancel,
}: IProps) {
  const formRef = useRef<undefined | FormInstance>();

  const { mutate, isLoading } = useMutation({
    mutationFn: updateSpuUpdateRecord,
    onSuccess() {
      setOpen(false);
      onCancel();
    },
  });

  const onOk = useCallback(() => {
    formRef?.current?.validateFields().then((res) => {
      mutate({ spu_id: spuId, ...res });
    });
  }, [mutate, spuId]);

  return (
    <Modal
      open={open}
      destroyOnClose
      okButtonProps={{ loading: isLoading }}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      title={<div className="text-center mb-[20px]">Create UpdateRecord</div>}
    >
      <ModalBody ref={formRef} />
    </Modal>
  );
}

const ModalBody = forwardRef((_, ref) => {
  const [form] = ProForm.useForm();

  useImperativeHandle(ref, () => form);

  return (
    <ProForm
      layout="horizontal"
      form={form}
      submitter={false}
      labelCol={{ flex: '90px' }}
    >
      <ProFormText
        name="title"
        label="Title"
        fieldProps={{
          minLength: 1,
          maxLength: 100,
          showCount: true,
        }}
        rules={[
          {
            required: true,
            message: 'please input title',
          },
        ]}
      />

      <ProFormEditor
        name="content"
        label="Content"
        rules={[
          {
            required: true,
            message: 'please input content',
          },
        ]}
        fieldProps={{
          children: <Toolbar />,
        }}
      />
    </ProForm>
  );
});
