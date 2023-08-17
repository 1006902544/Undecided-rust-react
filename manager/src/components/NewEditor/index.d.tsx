import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export * from './modules/index.d';
export type { BaseToggles } from './hooks/useBaseToggle';

export interface UploadFile<T = any, F = any> {
  url: string;
  data?: Record<string, any>;
  headers?: Record<string, any>;
  requests: (file: PriFile<T>) => PriFile<F>;
  fileRender?: (file: PriFile) => React.ReactNode;
}

export interface PriFile<T = any> extends File {
  response?: T;
  url?: string;
}

export type CustomElement = {
  type: string;
  children: CustomText[];

  url?: string;
  upload?: UploadFile;
};
export type CustomText = {
  text?: string;
  image?: {
    url: string;
  };
  upload?: UploadFile;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}