import { Button, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import Transfer from './Transfer';

export default function CheckMoreModalButton({
  refetch,
}: {
  refetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
    refetch();
  }, [refetch]);

  return (
    <>
      <Button type="link" onClick={onOpen}>
        check more
      </Button>
      <Modal
        style={{ pointerEvents: 'auto' }}
        open={open}
        onCancel={onCancel}
        destroyOnClose
        width={1000}
        title="Hot Activity"
        footer={null}
        modalRender={() => <Transfer />}
      />
    </>
  );
}
