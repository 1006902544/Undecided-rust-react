import React, { KeyboardEventHandler, useCallback } from 'react';
import { Editable } from 'slate-react';
import type { RenderLeafProps, RenderElementProps } from 'slate-react';
import './style.scss';
import { useEditorContext } from '../../';
import { ImageElement, UploadElement } from './components';
import type { Descendant } from 'slate';

export default function EditableContainer({ value }: { value?: Descendant[] }) {
  const { editor } = useEditorContext();

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'image':
        return <ImageElement {...props} />;
      case 'upload':
        return <UploadElement {...props} />;
      case 'inline':
        return (
          <p style={{ display: 'inline-block' }} {...props.attributes}>
            {props.children}
          </p>
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      editor?.insertNode({ children: [{ text: '' }], type: 'paragraph' });
    }
  };

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      return (
        <span
          style={{
            fontWeight: (leaf as any).bold ? 700 : 500,
            fontStyle: (leaf as any).italic ? 'italic' : undefined,
            fontSize: leaf.size ?? 16,
          }}
          {...attributes}
        >
          {children}
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
      onKeyDown={onKeyDown}
    />
  );
}
