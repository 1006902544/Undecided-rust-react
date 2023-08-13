import { createContext, useContext, useMemo } from 'react';
import type { Editor } from 'slate';

export interface EditorContext {
  editor?: Editor;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EditorContext = createContext<EditorContext>({});

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  return useMemo(() => context, [context]);
};
