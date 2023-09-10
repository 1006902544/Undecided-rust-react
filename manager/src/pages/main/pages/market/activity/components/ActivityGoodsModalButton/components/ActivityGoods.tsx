import { Button, Tabs, message } from 'antd';
import type { TabsProps } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import ActivityGoodsCurrent from './ActivityGoodsCurrent';
import ActivityGoodsList from './ActivityGoodsList';
import { useMutation } from '@tanstack/react-query';
import {
  updateActivityBundleGoods,
  updateActivityPromotionGoods,
} from '@/libs/api';
import { useUpdateContext } from '../../UpdateContext';

export interface Goods {
  spu_id: number;
  spu_name: string;
  sku_id?: number | null;
  sku_name?: string | null;
}

interface IProps {
  selected?: Goods[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

export default function ActivityGoods({
  selected: selectedProp,
  setOpen,
  refetch,
}: IProps) {
  const [selected, setSelected] = useState<Goods[]>(selectedProp || []);
  const { data } = useUpdateContext();

  const items = useMemo<TabsProps['items']>(
    () => [
      {
        key: 'list',
        label: 'List',
        children: (
          <ActivityGoodsList selected={selected} setSelected={setSelected} />
        ),
      },
      {
        key: 'current',
        label: 'Current',
        children: (
          <ActivityGoodsCurrent selected={selected} setSelected={setSelected} />
        ),
      },
    ],
    [selected, setSelected]
  );

  const { mutate: bundleMutate, isLoading: bundleLoading } = useMutation({
    mutationFn: updateActivityBundleGoods,
    onSuccess(data) {
      message.success(data.message);
      onCancel();
      refetch();
    },
  });
  const { mutate: promotionMutate, isLoading: promotionLoading } = useMutation({
    mutationFn: updateActivityPromotionGoods,
    onSuccess(data) {
      message.success(data.message);
      onCancel();
      refetch();
    },
  });

  const onCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const ensure = useCallback(() => {
    if (data?.base.activity_type === 'bundle') {
      bundleMutate({ id: data.base.id, goods: selected });
    } else if (data?.base.activity_type === 'promotion') {
      promotionMutate({ id: data.base.id, goods: selected });
    }
  }, [bundleMutate, data, promotionMutate, selected]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <Tabs items={items} />
      </div>

      <div className="flex justify-end space-x-4 flex-shrink-0">
        <Button
          size="large"
          onClick={onCancel}
          loading={bundleLoading || promotionLoading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={ensure}
          loading={bundleLoading || promotionLoading}
        >
          Ensure
        </Button>
      </div>
    </div>
  );
}
