'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';

export interface ModalProps {
  open?: boolean;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const time = 300;

type ClassNameType = 'modal-normal' | 'modal-closing';

export default function Modal({ open, ...rest }: ModalProps) {
  let [node, setNode] = useState<HTMLDivElement | undefined>(undefined);

  const timeRef = useRef<null | number>(null);

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        window.clearTimeout(timeRef.current);
        timeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      let node = document.createElement('div');
      node.style.cssText = `
        width:0;
        height:0;
        position:fixed;
        left:0;
        right:0;
        z-index:9999;
      `;
      setNode(node);
      document.body.appendChild(node);
    } else {
      if (document.body.lastElementChild === node) {
        timeRef.current = window.setTimeout(() => {
          document.body.removeChild(node!);
        }, time);
      }
    }
  }, [open]);

  return node
    ? createPortal(<ModalContainer {...rest} open={open} />, node)
    : null;
}

const ModalContainer = ({
  open,
  children,
  onCancel,
}: Omit<ModalProps, 'wrap'>) => {
  const [className, setClassName] = useState<ClassNameType>('modal-normal');

  useEffect(() => {
    if (open) {
      setClassName('modal-normal');
    } else {
      setClassName('modal-closing');
    }
  }, [open]);

  const containerClassName = useMemo(() => {
    return className === 'modal-closing'
      ? ' bg-[rgba(0,0,0,0)]'
      : ' bg-[rgba(0,0,0,0.2)]';
  }, [className]);

  return (
    <div
      className={
        'modal-container w-[100vw] h-[100vh] flex justify-center items-center' +
        containerClassName
      }
      onClick={(e) => {
        e.stopPropagation();
        onCancel?.();
      }}
    >
      <div
        className={'modal-body' + ' ' + className}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
