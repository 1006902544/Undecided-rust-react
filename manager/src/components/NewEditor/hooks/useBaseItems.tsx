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
      type: 'option',
      children: <span className="px-[8px] font-bold">Upload</span>,
      options: [
        {
          key: 'image',
          children: 'image',
          async toggle(editor, { uploadImage }) {
            uploadImage(editor, {
              url:
                (process.env.REACT_APP_UPLOAD_API_URL ?? '') +
                '/manager/upload',
              requests(file) {
                return file;
              },
              headers: {
                Authorization: getToken(),
              },
              fileRender(file) {
                return (
                  <img
                    alt=""
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                    src={file.response?.data?.url}
                  />
                );
              },
            });
          },
        },
      ],
    },
  ];

  // eslint-disable-next-line
  return useMemo(() => baseItems, []);
};
