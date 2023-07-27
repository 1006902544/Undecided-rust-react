import { deleteRouter } from '@/libs/api';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { useMenuManagementContext } from '../menuManagement';
import type { ButtonProps } from 'antd/lib/button';

interface IProps extends ButtonProps {
  routerKey?: number;
  children?: React.ReactNode;
  childNode?: React.ReactNode;
}

export default function DeleteButton({
  routerKey,
  children,
  childNode,
  ...props
}: IProps) {
  const [deleting, setDeleting] = useState(false);
  const { refetch } = useMenuManagementContext() ?? {};

  const onDelete = () => {
    if (routerKey) {
      Modal.confirm({
        title: 'Delete',
        content: 'Current item will be deleted permanently !',
        onOk() {
          setDeleting(true);
          deleteRouter({ key: routerKey })
            .then(() => {
              refetch?.();
            })
            .finally(() => setDeleting(false));
        },
      });
    }
  };

  return (
    <div onClick={onDelete} className=" inline-block">
      {childNode ?? (
        <Button
          type="link"
          style={{ color: 'brown' }}
          loading={deleting}
          {...props}
        >
          {children ?? 'DELETE'}
        </Button>
      )}
    </div>
  );
}
