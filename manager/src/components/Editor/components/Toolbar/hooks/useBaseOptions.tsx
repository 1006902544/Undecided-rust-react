import type { Option } from '../index.d';
import { BoldOption, ItalicOption, Menu } from '..';
import { useMemo } from 'react';
import { Editor } from 'slate';

export const useBaseOptions = () => {
  const baseOptions: Option[] = [
    {
      key: 'bold',
      children: <BoldOption />,
      toggle(editor, { baseToggle: { isBoldMarkActive } }) {
        if (isBoldMarkActive(editor)) {
          Editor.removeMark(editor, 'bold');
        } else {
          Editor.addMark(editor, 'bold', true);
        }
      },
    },
    {
      key: 'italic',
      children: <ItalicOption />,
      toggle(editor) {
        const marks = Editor.marks(editor) as any;
        const isItalic = !!marks.italic;
        if (isItalic) {
          Editor.removeMark(editor, 'italic');
        } else {
          Editor.addMark(editor, 'italic', true);
        }
      },
    },
    {
      key: 'upload',
      children: (
        <Menu
          configs={[
            {
              key: 'picture',
              label: 'picture',
            },
          ]}
        >
          P
        </Menu>
      ),
      type: 'menu',
    },
  ];

  // eslint-disable-next-line
  return useMemo(() => baseOptions, []);
};
