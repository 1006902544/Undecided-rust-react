import React, { useMemo } from 'react';
import { useEditorContext } from '../../';
import './style.scss';
import type { ToolbarProps } from './index.d';

export default function Toolbar({ items: itemsProps }: ToolbarProps) {
  const { editor } = useEditorContext();

  const items = useMemo(() => {
    const baseItems: any = [];
    if (itemsProps) {
      return itemsProps;
    } else {
      return baseItems;
    }
  }, [itemsProps]);

  if (!editor) {
    return <span>no editor context</span>;
  }

  return <div className="editor-toolbar p-[10px] flex"></div>;
}
