import { useBaseOptions } from './components/baseOptions';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { Option, ToolbarProps } from './index.d';
import { useEditorContext } from '../../';
import { baseToggle } from './components';
export * from './components';

export default function Toolbar({ options: optionsProp }: ToolbarProps) {
  const baseOptions: Option[] = [
    {
      key: 'bold',
      toggle: (editor, info) => {
        console.log(info.baseToggle.isCodeBlockActive(editor));
      },
      children: <span>B</span>,
    },
  ];
  const { editor } = useEditorContext();

  const options = useMemo(() => {
    if (!optionsProp) {
      return baseOptions;
    } else {
      return optionsProp(baseOptions);
    }
  }, [baseOptions, optionsProp]);

  if (!editor) {
    return <span>This component must be setup in editorContext</span>;
  }

  return (
    <Container className="pb-[5px] rounded-t-[3px]  border-[#e5e7eb] border-b-0 flex">
      {options.map(({ toggle, children, key }) => (
        <button
          key={key}
          className="option-item"
          onClick={() => toggle?.(editor, { key, baseToggle })}
        >
          {children}
        </button>
      ))}
    </Container>
  );
}

const Container = styled.div`
  box-shadow: 0 0 5px 0 #ccc;

  .option-item {
    flex-shrink: 0;
    margin-left: 5px;
    margin-top: 5px;
    padding: 2px 10px;
    border-radius: 3px;
    box-shadow: 0 0 3px 0 #ccc;

    &:active {
      transform: scale(0.9);
    }
  }
`;
