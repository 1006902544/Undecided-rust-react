import { useMemo } from 'react';
import { ToolbarItem } from '../index.d';

export const useBaseItems = () => {
  const baseItems: ToolbarItem[] = [
    {
      key: 'bold',
      children: <span className="px-[8px] font-bold">B</span>,
      toggle(editor, { handleBold }) {
        handleBold(editor);
      },
    },
    {
      key: 'italic',
      children: <span className="px-[8px] pr-[10px] font-bold italic">I</span>,
      toggle(editor, { handleItalic }) {
        handleItalic(editor);
      },
    },
    {
      key: 'upload',
      children: <span className="px-[8px] font-bold">Upload</span>,
      toggle(editor, { uploadImage }) {
        uploadImage(editor);
      },
    },
  ];

  // eslint-disable-next-line
  return useMemo(() => baseItems, []);
};
