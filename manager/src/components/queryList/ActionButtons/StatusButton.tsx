import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React from 'react';
import { useListContext } from '../hooks';
import { useMutation } from '@tanstack/react-query';

interface IProps extends ButtonProps {
  data?: Record<number | string | symbol, any>;
}

export default function StatusButton({ data, children, ...btnProps }: IProps) {
  const listContext = useListContext();

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => listContext?.resource?.handleStatus?.(data ?? {}),
    onSuccess: () => {
      listContext?.refetch();
    },
  });

  if (!listContext)
    return <span>this component must be setup in listContext</span>;

  const onClick = () => {
    mutate();
  };

  return (
    <Button onClick={onClick} type="link" loading={isLoading} {...btnProps}>
      {children}
    </Button>
  );
}
