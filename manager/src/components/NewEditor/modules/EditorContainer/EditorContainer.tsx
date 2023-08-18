import React from 'react';
import { Slate } from 'slate-react';
import { Editable, useEditorContext } from '../../';
import { EditorProps } from '../../index.d';

const initial = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export default function EditorContainer({
  children,
  initialValue = initial,
  ...props
}: EditorProps) {
  const { editor } = useEditorContext();

  if (!editor) {
    return <span>no editor context</span>;
  }

  return (
    <div className="shadow-xl rounded-[5px]">
      <Slate editor={editor} initialValue={props.value ?? initial} {...props}>
        {children}
        <Editable />
      </Slate>
    </div>
  );
}
