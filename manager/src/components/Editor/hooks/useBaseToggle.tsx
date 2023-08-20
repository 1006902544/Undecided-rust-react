import { useMemo } from 'react';
import { CustomElement, Editor, UploadFile } from '../index.d';

export interface BaseToggles {
  isBold: (editor: Editor) => boolean;
  isItalic: (editor: Editor) => boolean;
  handleBold: (editor: Editor) => void;
  handleItalic: (editor: Editor) => void;
  insertImage: (editor: Editor, url: string) => void;
  uploadImage: (editor: Editor, data: UploadFile) => void;
  setFontSize: (editor: Editor, size: number) => void;
  setTitle: (editor: Editor, size: number) => void;
  toggleList: (editor: Editor) => void;
}

export const useBaseToggle = () => {
  const baseToggle: BaseToggles = {
    isBold(editor) {
      const marks = editor.getMarks() as any;
      if (marks.bold === true) {
        return true;
      } else {
        return false;
      }
    },

    isItalic(editor) {
      const marks = editor.getMarks() as any;
      if (marks.italic === true) {
        return true;
      } else {
        return false;
      }
    },

    handleBold(editor) {
      const isBold = baseToggle.isBold(editor);
      if (isBold) {
        editor.removeMark('bold');
      } else {
        editor.addMark('bold', true);
      }
    },

    handleItalic(editor) {
      const isBold = baseToggle.isItalic(editor);
      if (isBold) {
        editor.removeMark('italic');
      } else {
        editor.addMark('italic', true);
      }
    },

    insertImage(editor, url) {
      editor.insertNodes({
        children: [{ text: '' }],
        type: 'image',
        image: {
          url,
          alt: url,
        },
      });
      editor.insertNodes({
        children: [{ text: '' }],
        type: 'inline',
      });
    },

    uploadImage(editor, upload) {
      editor.insertNodes({
        children: [{ text: '' }],
        type: 'upload',
        upload,
      });
      editor.insertNodes({
        children: [{ text: '' }],
        type: 'inline',
      });
    },

    setFontSize(editor, size) {
      editor.addMark('size', size);
    },

    setTitle(editor, size) {
      if (size < 1) {
        editor.setNodes({
          type: 'paragraph',
          children: editor.children,
        });
      } else {
        editor.setNodes({
          type: 'title',
          title: {
            level: size,
          },
          children: editor.children,
        });
      }
    },

    toggleList(editor) {
      const above = editor.above();
      if (above) {
        if ((above[0] as CustomElement)?.type === 'list') {
          editor.setNodes({
            type: 'paragraph',
            children: editor.children,
          });
        } else {
          editor.setNodes({
            type: 'list',
            children: editor.children,
          });
        }
      } else {
        editor.insertNode({
          type: 'list',
          children: [],
        });
      }
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => baseToggle, []);
};
