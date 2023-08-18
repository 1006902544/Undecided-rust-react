import React, { useCallback, useEffect, useState } from 'react';
import type { PopoverProps } from './Popover.d';
import { createPortal } from 'react-dom';
import './Popover.scss';

export default function Popover({ children, content }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<[number | string, number | string]>([
    0, 0,
  ]);

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.addEventListener('click', onCancel);
    } else {
      document.body.removeEventListener('click', onCancel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        const point = (e.target as HTMLElement).getBoundingClientRect();
        const left = Math.round(point.left);
        const top = Math.round(point.bottom + 5);
        setPoint([left, top]);
        setOpen(true);
      }}
    >
      {children}

      {open
        ? createPortal(
            <div
              className="popover-content-container p-[5px] rounded-[3px] shadow-lg bg-[white] fixed"
              style={{
                left: point[0] + 'px',
                top: point[1] + 'px',
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </span>
  );
}
