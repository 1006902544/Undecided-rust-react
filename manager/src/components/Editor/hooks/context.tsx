import { createContext, useContext, useMemo } from 'react';
import type { Editor } from 'slate';

export interface EditorContext {
  editor?: Editor;
}

export const EditorContext = createContext<EditorContext>({});

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  return useMemo(() => context, [context]);
};
