import { ProForm } from '@ant-design/pro-components';
import type { ProFormItemProps } from '@ant-design/pro-components';
import React from 'react';
import { Map } from './';

interface IProps extends ProFormItemProps {
  fieldProps?: {
    width?: string;
    height?: string;
  };
}

export default function ProFormMap({ fieldProps, ...props }: IProps) {
  return (
    <ProForm.Item {...props}>
      <Map width="100%" height="300px" {...fieldProps} />
    </ProForm.Item>
  );
}
