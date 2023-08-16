import { useMemo } from 'react';
import { Editor, UploadFile } from '../index.d';

export interface BaseToggles {
  isBold: (editor: Editor) => boolean;
  isItalic: (editor: Editor) => boolean;
  handleBold: (editor: Editor) => void;
  handleItalic: (editor: Editor) => void;
  insertImage: (editor: Editor) => void;
  uploadImage: (editor: Editor, data: UploadFile) => void;
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

    insertImage(editor) {
      editor.insertNodes({
        children: [{ text: '' }],
        type: 'image',
        url: 'http://124.71.205.17:9000/images/YORENmRf3e-fps.png',
      });
    },

    uploadImage(editor, upload) {
      editor.insertNodes({
        children: [{ text: '' }],
        type: 'upload',
        upload,
      });
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => baseToggle, []);
};
