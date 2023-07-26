'use client';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import type { PopoverAlign, PopoverProps } from './';
import { createPortal } from 'react-dom';
import { ContentContainer } from './components';

export default function popover({
  children,
  type = 'hover',
  content,
  className,
  style,
}: PopoverProps) {
  //basic data
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<PopoverAlign>({
    left: 0,
    width: 0,
    top: 0,
  });

  const get_align = (e: React.MouseEvent<Element, MouseEvent>) => ({
    width: (e.currentTarget as any)?.offsetWidth ?? 0,
    left: (e.currentTarget as any)?.offsetLeft ?? 0,
    top:
      ((e.currentTarget as any)?.offsetTop ?? 0) +
      (e.currentTarget as any)?.offsetHeight,
  });

  //type=hover
  const on_hover: MouseEventHandler = (e) => {
    if (type === 'hover') {
      setAlign(get_align(e));
      setOpen(true);
    }
  };

  const on_blur = () => {
    if (type === 'hover') {
      setOpen(false);
    }
  };

  //type=click
  const remove_fn_ref = useRef<null | (() => void)>(null);

  const on_click: MouseEventHandler = (e) => {
    if (type === 'click') {
      if (open) {
        if (remove_fn_ref.current) {
          remove_fn_ref.current();
        }
      } else {
        setAlign(get_align(e));
        remove_fn_ref.current = function () {
          setOpen(false);
          if (remove_fn_ref.current) {
            document.body.removeEventListener('click', remove_fn_ref.current);
          }
        };
        document.body.addEventListener('click', remove_fn_ref.current);
        setOpen(true);
      }
    }
  };

  return (
    <div
      onMouseEnter={on_hover}
      onMouseLeave={on_blur}
      onClick={on_click}
      className="relative"
    >
      {children}
      {open
        ? createPortal(
            <ContentContainer className={className} style={style} align={align}>
              {content}
            </ContentContainer>,
            document.body
          )
        : null}
    </div>
  );
}
