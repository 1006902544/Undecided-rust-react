import React, { useMemo } from 'react';
import { useBaseItems, useBaseToggle, useEditorContext } from '../../';
import './style.scss';
import type { ToolbarProps } from './index.d';
import { Popover } from '../components';

export default function Toolbar({ items: itemsProps }: ToolbarProps) {
  const { editor } = useEditorContext();
  const baseToggles = useBaseToggle();
  const baseItems = useBaseItems();

  const items = useMemo(() => {
    if (itemsProps) {
      return itemsProps(baseItems);
    } else {
      return baseItems;
    }
  }, [itemsProps, baseItems]);

  if (!editor) {
    return <span>no editor context</span>;
  }

  return (
    <div className="editor-toolbar p-[10px] flex space-x-[10px]">
      {items.map(({ children, options, type, key, toggle }) =>
        type === 'option' ? (
          <button key={key} className="editor-toolbar-item">
            <Popover
              content={
                <ul className=" overflow-y-scroll max-h-[300px]">
                  {options?.map((opt) => (
                    <li key={opt.key}>
                      <button
                        className=" px-[10px] hover:bg-[#ccc] rounded-[3px]  transition-all"
                        onClick={() => opt.toggle?.(editor, baseToggles)}
                      >
                        {opt.children}
                      </button>
                    </li>
                  ))}
                </ul>
              }
            >
              {children}
            </Popover>
          </button>
        ) : (
          <button
            key={key}
            onClick={() => {
              toggle?.(editor, baseToggles);
            }}
            className="editor-toolbar-item"
          >
            {children}
          </button>
        )
      )}
    </div>
  );
}
