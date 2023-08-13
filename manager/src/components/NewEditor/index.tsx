import { EditorProvider, EditorContainer } from './modules';
export * from './hooks';
export * from './modules';

interface IProps {
  children?: React.ReactNode;
}

export const Editor = ({ children }: IProps) => {
  return (
    <EditorProvider>
      <EditorContainer>{children}</EditorContainer>
    </EditorProvider>
  );
};
