import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import List from './list';

interface IProps {
  rkey: number;
}

export default function AssociateModalButton({ rkey }: IProps) {
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={onOpen} type="link">
        ASSOCIATE
      </Button>
      <Modal
        open={open}
        onCancel={onCancel}
        title="Associate"
        width={1200}
        footer={
          <div>
            <Button type="primary" size="large">
              cancel
            </Button>
          </div>
        }
      >
        <List rkey={rkey} />
      </Modal>
    </>
  );
}
