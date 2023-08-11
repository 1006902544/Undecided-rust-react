import React, { useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { CustomEditor, Toolbar } from './components';
import styled from 'styled-components';
import { EditorContext } from './hooks';
export * from './hooks';
export * from './index.d';

const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  );
};

export default function EditorContainer() {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'code':
        return <strong {...props} />;
      default:
        return <p {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Container
        editor={editor}
        initialValue={[
          {
            type: 'paragraph',
            children: [{ text: '' }],
          } as any,
        ]}
      >
        <Toolbar />
        <Editable
          className="editable border-[1px] p-[10px] outline-none rounded-b-[5px]"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }
            switch (event.key) {
              case '`': {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }
              case 'b': {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }
            }
          }}
        />
      </Container>
    </EditorContext.Provider>
  );
}

const Container = styled(Slate)`
  .editable {
    border: 1px solid #ccc;
  }
`;
