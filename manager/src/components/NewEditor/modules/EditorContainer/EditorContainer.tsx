import React from 'react';
import { Slate } from 'slate-react';
import { Editable, useEditorContext } from '../../';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

interface IProps {
  children?: React.ReactNode;
}

export default function EditorContainer({ children }: IProps) {
  const { editor } = useEditorContext();

  if (!editor) {
    return <span>no editor context</span>;
  }

  return (
    <div className=" shadow-xl rounded-[5px]">
      <Slate editor={editor} initialValue={initialValue}>
        {children}
        <Editable />
      </Slate>
    </div>
  );
}
