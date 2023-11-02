import { Button, Modal } from 'antd';
import type { ModalProps } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

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
  const onOpen = () => {
    setOpen(true);
  };

  const onCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      modalProps?.onCancel?.(e);
      setOpen(false);
    },
    [modalProps]
  );

  const onOk = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      modalProps?.onOk?.(e);
      onCancel(e);
    },
    [modalProps, onCancel]
  );

  return (
    <ModalButtonContext.Provider value={{ open, setOpen }}>
      <Button {...btnProps} onClick={onOpen}>
        {label}
      </Button>

      <Modal
        open={open}
        destroyOnClose
        {...modalProps}
        onOk={onOk}
        onCancel={onCancel}
      >
        {children}
      </Modal>
    </ModalButtonContext.Provider>
  );
}
