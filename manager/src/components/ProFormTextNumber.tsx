import { ProForm } from '@ant-design/pro-components';
import React from 'react';
import type { ProFormItemProps } from '@ant-design/pro-components';
import { InputNumber, type InputNumberProps } from 'antd';

interface IProps extends Omit<ProFormItemProps, 'fieldProps'> {
  fieldProps?: InputNumberProps;
}

export default function ProFormTextNumber({
  fieldProps,
  readonly,
  ...props
}: IProps) {
  return (
    <ProForm.Item {...props}>
      <InputNumber
        readOnly={readonly}
        bordered={readonly ? false : fieldProps?.bordered}
        {...fieldProps}
      />
    </ProForm.Item>
  );
}
