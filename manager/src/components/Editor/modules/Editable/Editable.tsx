import React, { KeyboardEventHandler, useCallback } from 'react';
import { Editable } from 'slate-react';
import type { RenderLeafProps, RenderElementProps } from 'slate-react';
import './style.scss';
import { useEditorContext } from '../../';
import {
  ImageElement,
  TitleElement,
  UploadElement,
  ListElement,
} from './components';
import { CustomElement } from '../../index.d';

export default function EditableContainer() {
  const { editor } = useEditorContext();

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'image':
        return <ImageElement {...props} />;
      case 'upload':
        return <UploadElement {...props} />;
      case 'title':
        return <TitleElement {...props} />;
      case 'list':
        return <ListElement {...props} />;
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
      const [above] = editor?.above() ?? [];
      if (above && (above as CustomElement).type === 'list') {
        if (
          (above as CustomElement).children.every((c) => c.text?.trim() === '')
        ) {
          editor?.setNodes({ children: [{ text: '' }], type: 'paragraph' });
        } else {
          editor?.insertNode({ children: [{ text: '' }], type: 'list' });
        }
      } else {
        editor?.insertNode({ children: [{ text: '' }], type: 'paragraph' });
      }
    }
  };

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      return (
        <span
          style={{
            fontWeight: (leaf as any).bold ? 700 : undefined,
            fontStyle: (leaf as any).italic ? 'italic' : undefined,
            fontSize: leaf.size,
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
