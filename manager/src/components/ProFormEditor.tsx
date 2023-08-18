import { ProForm } from '@ant-design/pro-components';
import type { ProFormItemProps } from '@ant-design/pro-components';
import React, { useCallback } from 'react';
import { Editor } from '@/components/';
import type { EditorProps } from '@/components/NewEditor/index.d';
import type { Descendant } from 'slate';

interface IProps extends ProFormItemProps {
  fieldProps?: FieldProps;
}

interface FieldProps extends Omit<EditorProps, 'onChange' | 'value'> {
  onChange?: (value: string) => void;
  value?: string;
}

export default function ProFormEditor({ fieldProps, ...props }: IProps) {
  return (
    <ProForm.Item {...props}>
      <EditorContainer {...fieldProps}>{fieldProps?.children}</EditorContainer>
    </ProForm.Item>
  );
}

const EditorContainer = ({ children, ...props }: FieldProps) => {
  const serialize = useCallback((value: Descendant[]) => {
    return JSON.stringify(value);
  }, []);

  const deserialize = useCallback((string?: string) => {
    return string ? JSON.parse(string) : undefined;
  }, []);

  const onChange = (value: Descendant[]) => {
    props.onChange?.(serialize(value));
  };

  return (
    <Editor {...props} value={deserialize(props.value)} onChange={onChange}>
      {children}
    </Editor>
  );
};
