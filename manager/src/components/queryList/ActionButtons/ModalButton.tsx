import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Button } from 'antd';
import type { ModalProps } from 'antd';
import { ButtonProps } from 'antd/lib/button';

type ActionType = 'delete' | 'update' | 'check';

interface IProps extends ButtonProps {
  actionType?: ActionType;
  modalProps?: ModalProps;
  label?: string;
  onceOpen?: () => void;
  onceCancel?: () => void;
}

export default function ModalButton({
  children,
  actionType,
  modalProps,
  label,
  onceOpen,
  onceCancel,
  ...btnProps
}: IProps) {
  //handle modal open
  const [open, setOpen] = useState(false);

  const onCancel = useCallback(() => {
    setOpen(false);
    onceCancel?.();
  }, []);

  const onOpen = useCallback(() => {
    onceOpen?.();
    setOpen(true);
  }, []);

  return (
    <>
      <Button type="link" {...btnProps} onClick={onOpen}>
        {label}
      </Button>
      <Modal open={open} {...modalProps} onCancel={onCancel}>
        {children}
      </Modal>
    </>
  );
}
