import type { Option } from '../index.d';
import { BoldOption } from '.';
import { useMemo } from 'react';

export const useBaseOptions = () => {
  const baseOptions: Option[] = [
    {
      key: 'bold',
      children: <BoldOption />,
      toggle(editor, info) {
        console.log(info.baseToggle.isBoldMarkActive(editor));
      },
    },
  ];

  return useMemo(() => baseOptions, []);
};
