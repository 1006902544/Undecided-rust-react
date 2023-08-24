import { Button, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { CreateImage } from './';

interface IProps {
  reset?: () => void;
}

export default function CreateImageModalButton({ reset }: IProps) {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const ensure = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <>
      <Button onClick={onOpen} type="primary">
        Create
      </Button>
      <Modal
        onCancel={onCancel}
        afterClose={reset}
        open={open}
        title="Create Image"
        destroyOnClose
        footer={
          <div className="flex justify-end">
            <Button type="primary" onClick={ensure}>
              Ensure
            </Button>
          </div>
        }
      >
        <CreateImage />
      </Modal>
    </>
  );
}
