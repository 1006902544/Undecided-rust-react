import { Button, Modal } from 'antd';
import type { ModalProps } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useState } from 'react';

interface IProps extends ButtonProps {
  modalProps?: ModalProps;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

export default function ModalButton({
  label,
  children,
  modalProps,
  ...btnProps
}: IProps) {
  const [open, setOpen] = useState(false);
  const onOk = () => {
    setOpen(true);
  };
  const onCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={onOk} {...btnProps}>
        {label}
      </Button>
      <Modal open={open} onCancel={onCancel} destroyOnClose {...modalProps}>
        {children}
      </Modal>
    </>
  );
}
