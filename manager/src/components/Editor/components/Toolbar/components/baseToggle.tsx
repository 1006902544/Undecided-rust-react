import { CustomElement } from '../../../';
import { Editor } from 'slate';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

export const baseToggle = {
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
};

export interface BaseToggle {
  isBoldMarkActive: (editor: BaseEditor & ReactEditor) => boolean;
  isCodeBlockActive: (editor: BaseEditor & ReactEditor) => boolean;
}
