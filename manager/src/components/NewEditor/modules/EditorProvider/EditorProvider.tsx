import type { EditorContextInterface } from './index.d';
import React, { createContext, useState } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';

export const EditorContext = createContext<EditorContextInterface>({});

interface IProps {
  children?: React.ReactNode;
}

export default function EditorProvider({ children }: IProps) {
  const [editor] = useState(() => withReact(createEditor()));

  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
}
