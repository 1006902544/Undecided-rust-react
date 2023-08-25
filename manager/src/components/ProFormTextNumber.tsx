import { ProForm } from '@ant-design/pro-components';
import React from 'react';
import type { ProFormItemProps } from '@ant-design/pro-components';
import { InputNumber, type InputNumberProps } from 'antd';

interface IProps extends Omit<ProFormItemProps, 'fieldProps'> {
  fieldProps?: InputNumberProps;
}

export default function ProFormTextNumber({ fieldProps, ...props }: IProps) {
  return (
    <ProForm.Item {...props}>
      <InputNumber {...fieldProps} />
    </ProForm.Item>
  );
}
