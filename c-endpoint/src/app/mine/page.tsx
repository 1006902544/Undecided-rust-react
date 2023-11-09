'use client';
import { Spin, message } from '@/lib/components';
import { useUserStore } from '@/lib/store/user';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';

export default function Page() {
  const userStore = useUserStore((state) => state);

  const init = useCallback(async () => {
    userStore.initToken();
    if (!userStore.token) {
      userStore.clearAuth();
    }
    if (!userStore.user) {
      userStore.getUserInfo();
    }
    return {};
  }, [userStore]);

  const { isLoading } = useQuery({
    queryFn: init,
    queryKey: ['init'],
  });

  const onClick = () => {
    message.default('cccccc');
  };

  return (
    <Spin
      className="h-full"
      label="Loading"
      color="danger"
      size="lg"
      labelColor="danger"
      loading={isLoading}
    >
      <div className="h-full">
        <Button onClick={onClick}>adaad</Button>
      </div>
    </Spin>
  );
}
