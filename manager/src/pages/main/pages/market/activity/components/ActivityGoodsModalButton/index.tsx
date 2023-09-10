import type { Resource } from '@/components';
import { getSpuTreeLimit } from '@/libs/api';
import { Button } from 'antd';
import { Modal } from 'antd/lib';
import React, { useCallback, useState } from 'react';
import { ActivityGoods } from './components';
import styled from 'styled-components';
import { Goods } from './components/ActivityGoods';

interface IProps {
  selected?: Goods[];
  refetch: () => void;
}

export default function ActivityGoodsModalButton({
  selected,
  refetch,
}: IProps) {
  const [open, setOpen] = useState(false);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button onClick={onOpen} type="primary" className="mb-[10px]">
        AddGoods
      </Button>
      <ModalContainer
        onCancel={onCancel}
        destroyOnClose
        open={open}
        title="Goods"
        footer={null}
        width={1200}
        centered
      >
        <ActivityGoods
          setOpen={setOpen}
          selected={selected}
          refetch={refetch}
        />
      </ModalContainer>
    </>
  );
}

export const name = 'marketActivityGoodsModalButtonResource';

export const marketActivityGoodsModalButtonResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSpuTreeLimit({ ...data, ...pagination });
    return {
      data: res.results,
      current: res.current,
      total: res.total,
    };
  },
};

const ModalContainer = styled(Modal)`
  .ant-modal-body {
    max-height: 800px !important;
    height: 800px;
  }
`;
