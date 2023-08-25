import React, { useCallback } from 'react';
import {
  ProFormSelect,
  type ProFormSelectProps,
} from '@ant-design/pro-components';
import type { Keys } from './proFormSelectKeys';
import { proFormSelectKeys } from './proFormSelectKeys';

interface IProps extends ProFormSelectProps {
  keyCode: Keys;
}

export default function ProFormSelectList({ keyCode, ...props }: IProps) {
  const request = useCallback(async () => {
    const request = proFormSelectKeys[keyCode];
    const { data } = await request();
    return data;
  }, [keyCode]);

  return <ProFormSelect request={request} {...props} />;
}
