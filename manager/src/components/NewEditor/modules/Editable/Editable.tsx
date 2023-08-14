import React, { useCallback } from 'react';
import { Editable } from 'slate-react';
import type { RenderLeafProps, RenderElementProps } from 'slate-react';
import './style.scss';

export default function EditableContainer() {
  const renderElement = useCallback((props: RenderElementProps) => {
    console.log(props);

    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      return (
        <span
          style={{
            fontWeight: (leaf as any).bold ? 700 : 500,
            fontStyle: (leaf as any).italic ? 'italic' : undefined,
          }}
          {...attributes}
        >
          {children ?? ''}
        </span>
      );
    },
    []
  );

  return (
    <Editable
      className="editor-editable"
      renderElement={renderElement}
      renderLeaf={renderLeaf}
    />
  );
}
