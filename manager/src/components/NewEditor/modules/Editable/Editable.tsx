import React, { useCallback } from 'react';
import { Editable } from 'slate-react';
import type { RenderLeafProps, RenderElementProps } from 'slate-react';
import './style.scss';

export default function EditableContainer() {
  const renderElement = useCallback((props: RenderElementProps) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <span {...props.attributes}>{props.children}</span>;
  }, []);

  return (
    <Editable
      className="editor-editable"
      renderElement={renderElement}
      renderLeaf={renderLeaf}
    />
  );
}
