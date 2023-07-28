import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import List from './list';

interface IProps {
  rkey: number;
  childNode?: React.ReactNode;
}

export default function AssociateModalButton({ rkey, childNode }: IProps) {
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };
  const onCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <span onClick={onOpen}>
        {childNode ?? <Button type="link">ASSOCIATE</Button>}
      </span>

      <Modal
        open={open}
        onCancel={onCancel}
        title="Associate"
        width={1200}
        footer={null}
      >
        <List rkey={rkey} />
      </Modal>
    </>
  );
}
