import { EditorProps } from './index.d';
import { EditorProvider, EditorContainer } from './modules';
export * from './hooks';
export * from './modules';

export const Editor = ({ children, ...props }: EditorProps) => {
  return (
    <EditorProvider>
      <EditorContainer onChange={props.onChange}>{children}</EditorContainer>
    </EditorProvider>
  );
};
