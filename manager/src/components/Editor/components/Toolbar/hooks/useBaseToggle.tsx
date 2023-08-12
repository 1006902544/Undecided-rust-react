import { useMemo } from 'react';
import { CustomElement } from '../../../';
import { Editor, Transforms } from 'slate';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

export interface BaseToggle {
  isBoldMarkActive: (editor: BaseEditor & ReactEditor) => boolean;
  isCodeBlockActive: (editor: BaseEditor & ReactEditor) => boolean;
  changeType: (editor: BaseEditor & ReactEditor, type: string) => void;
}

export const useBaseToggle = () => {
  const baseToggle: BaseToggle = {
    isBoldMarkActive(editor: BaseEditor & ReactEditor) {
      const marks = Editor.marks(editor);
      return marks ? (marks as any).bold === true : false;
    },

    isCodeBlockActive(editor: BaseEditor & ReactEditor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => (n as CustomElement).type === 'code',
      });
      return !!match;
    },

    changeType(editor: BaseEditor & ReactEditor, type: string) {
      Transforms.setNodes(editor, { type });
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => baseToggle, []);
};
