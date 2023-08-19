import type { Editor, EditorContextInterface } from './index.d';
import React, { createContext, useState } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';

export const EditorContext = createContext<EditorContextInterface>({});

interface IProps {
  children?: React.ReactNode;
}

export default function EditorProvider({ children }: IProps) {
  const withEmbeds = (editor: Editor) => {
    const { isVoid } = editor;
    editor.isVoid = (element) =>
      element.type === 'image' || element.type === 'upload'
        ? true
        : isVoid(element);
    return editor;
  };

  const [editor] = useState(() => withEmbeds(withReact(createEditor())));

  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
}
