import { Button, Modal } from 'antd';
import type { ModalProps } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface IModalButtonContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalButtonContext = createContext<
  undefined | IModalButtonContext
>(undefined);

export const useModalButtonContext = () => {
  const context = useContext(ModalButtonContext);

  return useMemo(() => context, [context]);
};

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
  const onCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    modalProps?.onCancel?.(e);
    setOpen(false);
  };

  return (
    <ModalButtonContext.Provider value={{ open, setOpen }}>
      <Button onClick={onOk} {...btnProps}>
        {label}
      </Button>
      <Modal open={open} destroyOnClose {...modalProps} onCancel={onCancel}>
        {children}
      </Modal>
    </ModalButtonContext.Provider>
  );
}
