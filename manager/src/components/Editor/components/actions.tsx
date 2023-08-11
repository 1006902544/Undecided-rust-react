import { Editor, Transforms } from 'slate';
import type { CustomElement } from '../index.d';

export const CustomEditor = {
  isBoldMarkActive(editor: any) {
    const marks = Editor.marks(editor);
    return marks ? (marks as any).bold === true : false;
  },

  isCodeBlockActive(editor: any) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as CustomElement).type === 'code',
    });

    return !!match;
  },

  toggleBoldMark(editor: any) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, 'bold');
    } else {
      Editor.addMark(editor, 'bold', true);
    }
  },

  toggleCodeBlock(editor: any) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(editor, { type: isActive ? null : 'code' } as any, {
      match: (n) => Editor.isBlock(editor, n as CustomElement),
    });
  },
};
