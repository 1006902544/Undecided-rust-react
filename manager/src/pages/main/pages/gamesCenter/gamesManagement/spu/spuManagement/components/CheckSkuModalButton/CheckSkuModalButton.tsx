import { Button, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import CheckSkuList from './list';

interface IProps {
  spu_id: number;
  spu_name: string;
}

export default function CheckSkuModalButton({ spu_id, spu_name }: IProps) {
  const [open, setOpen] = useState(false);

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <Button type="link" onClick={onOpen}>
        CheckSku
      </Button>
      <Modal
        footer={null}
        open={open}
        onCancel={onCancel}
        width={800}
        destroyOnClose
        title={`${spu_name} sku`}
      >
        <CheckSkuList spu_id={spu_id} spu_name={spu_name} />
      </Modal>
    </>
  );
}
