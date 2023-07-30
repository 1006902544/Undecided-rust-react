import React, { useEffect, useState } from 'react';
import { ProForm } from '@ant-design/pro-components';
import { ColorPicker, ColorPickerProps } from 'antd';
import type { ProFormItemProps } from '@ant-design/pro-components';
import type { Color } from 'antd/es/color-picker';
import type { NamePath } from 'antd/es/form/interface';

interface IProps extends ProFormItemProps {
  name: NamePath;
  fieldProps?: FieldProps;
  defaultColor?: string;
}

interface FieldProps extends Omit<ColorPickerProps, 'onChange'> {
  name: NamePath;
  onChange?: (v: string) => void;
  defaultColor?: string;
}

export default function ProFormHexColorPicker({
  name,
  fieldProps,
  defaultColor,
  ...props
}: IProps) {
  return (
    <ProForm.Item name={name} {...props}>
      <ColorPickerContainer
        defaultColor={defaultColor}
        name={name}
        {...fieldProps}
      />
    </ProForm.Item>
  );
}

const ColorPickerContainer = ({
  onChange: onChangeProp,
  name,
  defaultColor = '#4096ff',
  ...props
}: FieldProps) => {
  const value = ProForm.useWatch(name);
  const form = ProForm.useFormInstance();

  useEffect(() => {
    if (!value) {
      form.setFieldValue(name, defaultColor);
    }
  }, [value]);

  const onChange = (_: Color, hex: string) => {
    onChangeProp?.(hex);
  };

  return (
    <ColorPicker
      onChange={onChange}
      defaultValue={defaultColor}
      {...props}
      format="hex"
      showText
    />
  );
};
