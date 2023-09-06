import { Button, Modal } from 'antd';
import type { ModalFuncProps } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useCallback } from 'react';
import { useListContext } from '../hooks';
import { useMutation } from '@tanstack/react-query';

interface IProps extends ButtonProps {
  data?: Record<number | string | symbol, any>;
  confirmProps?: ModalFuncProps;
  onSuccess?: () => any;
}

export default function StatusButton({
  data,
  onSuccess: onSuccessProps,
  children,
  confirmProps,
  ...btnProps
}: IProps) {
  const listContext = useListContext();

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => listContext?.resource?.handleStatus?.(data ?? {}),
    onSuccess: () => {
      onSuccessProps?.();
      listContext?.refetch();
    },
  });

  const onClick = useCallback(() => {
    Modal.confirm({
      okText: 'Ensure',
      cancelText: 'Cancel',
      onOk: () => mutate(),
      title: 'Status',
      content: 'Are you sure to change status ?',
      okButtonProps: {
        loading: isLoading,
      },
      cancelButtonProps: {
        loading: isLoading,
      },
      ...confirmProps,
    });
  }, [confirmProps, isLoading, mutate]);

  if (!listContext)
    return <span>this component must be setup in listContext</span>;

  return (
    <Button onClick={onClick} type="link" loading={isLoading} {...btnProps}>
      {children}
    </Button>
  );
}
