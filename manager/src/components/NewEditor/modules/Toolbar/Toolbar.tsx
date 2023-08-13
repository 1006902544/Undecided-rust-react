import React, { useMemo } from 'react';
import { useBaseItems, useEditorContext } from '../../';
import './style.scss';
import type { ToolbarProps } from './index.d';

export default function Toolbar({ items: itemsProps }: ToolbarProps) {
  const { editor } = useEditorContext();
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
    <div className="editor-toolbar p-[10px] flex">
      {items.map(({ children, options, type, key, toggle }) =>
        type === 'option' ? (
          <button key={key} className="editor-toolbar-item">
            {children}
          </button>
        ) : (
          <button
            key={key}
            onClick={() => {
              toggle?.(editor);
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
