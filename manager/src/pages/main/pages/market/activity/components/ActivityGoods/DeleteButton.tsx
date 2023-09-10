import {
  deleteActivityGoodsBundle,
  deleteActivityGoodsPromotion,
} from '@/libs/api';
import { useMutation } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import React, { useCallback } from 'react';
import { useUpdateContext } from '../UpdateContext';

export default function DeleteButton({
  id,
  spu_id,
  sku_id,
  refetch,
}: {
  id: number;
  spu_id: number;
  sku_id?: number;
  refetch: () => void;
}) {
  const { data } = useUpdateContext();

  const { mutate: mutateBundle, isLoading: bundleLoading } = useMutation({
    mutationFn: deleteActivityGoodsBundle,
    onSuccess() {
      refetch();
    },
  });

  const { mutate: mutatePromotion, isLoading: promotionLoading } = useMutation({
    mutationFn: deleteActivityGoodsPromotion,
    onSuccess() {
      refetch();
    },
  });

  const onClick = useCallback(() => {
    Modal.confirm({
      okText: 'Ok',
      cancelText: 'cancel',
      title: 'Delete',
      content: 'Are you want to delete this goods from this activity ?',
      onOk() {
        if (data?.base.activity_type === 'bundle') {
          mutateBundle({ id, spu_id, sku_id });
        } else if (data?.base.activity_type === 'promotion') {
          mutatePromotion({ id, spu_id, sku_id });
        }
      },
    });
  }, [
    data?.base.activity_type,
    id,
    mutateBundle,
    mutatePromotion,
    sku_id,
    spu_id,
  ]);

  return (
    <Button
      type="link"
      onClick={onClick}
      loading={bundleLoading || promotionLoading}
    >
      Delete
    </Button>
  );
}
