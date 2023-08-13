import { useMemo } from 'react';
import { CustomElement } from '../../../';
import { Editor, Transforms } from 'slate';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

export interface BaseToggle {
  isBoldMarkActive: (editor: BaseEditor & ReactEditor) => boolean;
  isCodeBlockActive: (editor: BaseEditor & ReactEditor) => boolean;
  changeType: (editor: BaseEditor & ReactEditor, type: string) => void;
  uploadFile: (editor: BaseEditor & ReactEditor, option?: UploadOption) => void;
}

export const useBaseToggle = () => {
  const baseToggle: BaseToggle = {
    isBoldMarkActive(editor: BaseEditor & ReactEditor) {
      const marks = Editor.marks(editor);
      return marks ? (marks as any).bold === true : false;
    },

    isCodeBlockActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => (n as CustomElement).type === 'code',
      });
      return !!match;
    },

    changeType(editor, type) {
      Transforms.setNodes(editor, { type });
    },

    uploadFile(editor, option) {
      let currentPath = editor?.selection?.anchor.path[0];
      if (!currentPath) {
        currentPath = 0;
      }
      // Editor.addMark(editor, 'italic', true);
      editor.insertNodes({
        type: 'image',
        children: [
          {
            node: <p className="text-[red]">XXXXXX</p>,
          },
        ],
      });
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => baseToggle, []);
};

interface UploadOption {
  action: string;
  file: File;
  data?: Record<string, any>;
  headers?: Record<string, any>;
  beforeUpload?: (file: File) => undefined | File | void;
  onSuccess?: (file: File) => void;
}
