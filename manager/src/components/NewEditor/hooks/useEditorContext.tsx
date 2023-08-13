import { useContext, useMemo } from 'react';
import { EditorContext } from '../';

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  return useMemo(() => context, [context]);
};
