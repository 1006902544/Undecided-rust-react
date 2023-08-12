import { useBaseOptions, useBaseToggle } from './hooks';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { ToolbarProps } from './index.d';
import { useEditorContext } from '../../';
import { Menu } from './components';
export * from './components';
export * from './hooks';

export default function Toolbar({ options: optionsProp }: ToolbarProps) {
  const baseOptions = useBaseOptions();
  const baseToggle = useBaseToggle();
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
    <Container className="pb-[5px] rounded-t-[3px]  border-[#e5e7eb] flex">
      {options.map(({ toggle, children, key, type, configs }) =>
        type !== 'click' ? (
          <button
            key={key}
            className="option-item"
            onClick={(e) => {
              e.preventDefault();
              toggle?.(editor, { key, baseToggle });
            }}
          >
            {children}
          </button>
        ) : (
          <Menu key={key} configs={configs}>
            <button className="option-item">{children}</button>
          </Menu>
        )
      )}
    </Container>
  );
}

const Container = styled.div`
  box-shadow: 0 0 5px 0 #ccc;

  .option-item {
    flex-shrink: 0;
    margin-left: 5px;
    margin-top: 5px;
    border-radius: 3px;
    box-shadow: 0 0 3px 0 #ccc;
    position: relative;

    &:active {
      transform: scale(0.9);
    }
  }
`;
