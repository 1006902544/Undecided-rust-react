import { Button, Modal } from 'antd';
import React from 'react';
import type { ButtonProps } from 'antd/lib/button';
import { useListContext } from '../';

interface IProps<T extends Record<string, any> = any>
  extends Omit<ButtonProps, 'id'> {
  confirmTitle?: React.ReactNode;
  confirmContent?: React.ReactNode;
  data?: T;
  id?: string | number;
}

export default function DeleteButton({
  confirmTitle,
  confirmContent,
  children,
  data = {},
  id,
  ...btnProps
}: IProps) {
  const listContext = useListContext();

  const onDelete = () => {
    Modal.confirm({
      title: confirmTitle ?? 'Delete',
      content: confirmContent ?? 'This item will be removed permanently !',
      onOk() {
        listContext?.mutations.deleteMutation.mutate({ data, id });
      },
    });
  };

  if (!listContext)
    return <span>this component must be setup in listContext</span>;

  return (
    <Button
      type="link"
      style={{ color: '#af0000', ...btnProps.style }}
      {...btnProps}
      onClick={onDelete}
    >
      Delete
    </Button>
  );
}
