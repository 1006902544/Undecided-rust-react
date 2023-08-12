import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { MenuProps, MenuListProps } from './index.d';
import { useEditorContext } from '@/components/Editor/hooks';
import { useBaseToggle } from '../../';
import './style.scss';
import { createPortal } from 'react-dom';

export default function Menu({ children, configs }: MenuProps) {
  const { editor } = useEditorContext();

  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState([0, 0]);

  if (!editor) {
    return <span>This component must be setup in editorContext</span>;
  }

  return (
    <span
      className="toolbar-menu inline-block w-full h-full "
      onClick={(e) => {
        e.stopPropagation();
        setPoint([
          e.clientX - e.nativeEvent.offsetX,
          e.clientY +
            ((e.target as any).offsetHeight - e.nativeEvent.offsetY) +
            5,
        ]);
        setOpen(true);
      }}
    >
      <div className="w-[40px] h-full">{children}</div>

      <MenuList
        configs={configs}
        open={open}
        setOpen={setOpen}
        point={point}
        editor={editor}
      />
    </span>
  );
}

const MenuList = ({ configs, open, setOpen, point, editor }: MenuListProps) => {
  const baseToggle = useBaseToggle();

  const rootRef = useRef<null | HTMLDivElement>(null);

  const onClose = useCallback(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuList = useMemo(() => {
    if (open) {
      const root = document.createElement('div');
      rootRef.current = root;
      document.body.appendChild(root);
      document.body.addEventListener('click', onClose);
      return createPortal(
        <ul
          className={`toolbar-menu-options px-[5px] py-[2px] flex flex-col fixed bg-[white] cursor-pointer rounded-[3px]`}
          style={{
            left: point[0],
            top: point[1],
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {configs?.map(({ key, label, toggle }) => (
            <li
              key={key}
              className="px-[5px] rounded-[3px]"
              onClick={() =>
                toggle?.(editor, {
                  key,
                  baseToggle,
                })
              }
            >
              {label}
            </li>
          ))}
        </ul>,
        root
      );
    } else {
      document.body.removeEventListener('click', onClose);
      if (rootRef.current) {
        document.body.removeChild(rootRef.current);
      }
      return null;
    }
  }, [open]);

  return menuList;
};
