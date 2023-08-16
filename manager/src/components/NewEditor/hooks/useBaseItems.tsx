import { useMemo } from 'react';
import { ToolbarItem } from '../index.d';
import { getToken } from '@/utils';

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
      async toggle(editor, { uploadImage }) {
        uploadImage(editor, {
          url: (process.env.REACT_APP_UPLOAD_API_URL ?? '') + '/manager/upload',
          requests(file) {
            return file;
          },
          headers: {
            Authorization: getToken(),
          },
        });
      },
    },
  ];

  // eslint-disable-next-line
  return useMemo(() => baseItems, []);
};
