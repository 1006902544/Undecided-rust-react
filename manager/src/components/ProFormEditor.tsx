import { ProForm } from '@ant-design/pro-components';
import type { ProFormItemProps } from '@ant-design/pro-components';
import React from 'react';
import { Editor } from '@/components/';
import type { EditorProps } from '@/components/NewEditor/index.d';
import { Node } from 'slate';

interface IProps extends ProFormItemProps {
  fieldProps?: EditorProps;
}

export default function ProFormEditor({ fieldProps, ...props }: IProps) {
  return (
    <ProForm.Item {...props}>
      <EditorContainer {...fieldProps}>{fieldProps?.children}</EditorContainer>
    </ProForm.Item>
  );
}

const serialize = (value: any) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n: any) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  );
};

const deserialize = (string: string) => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map((line) => {
    return {
      children: [{ text: line }],
    };
  });
};

const EditorContainer = ({ children, ...props }: EditorProps) => {
  return (
    <Editor
      {...props}
      onChange={(v) => {
        console.log(v);
      }}
    >
      {children}
    </Editor>
  );
};
