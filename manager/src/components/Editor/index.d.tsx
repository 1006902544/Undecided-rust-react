import type { CSSProperties } from 'react';
import type { BaseEditor, Descendant } from 'slate';
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

export interface ImageEle {
  url: string;
  alt?: string;
}
export interface PriFile<T = any> extends File {
  response?: T;
  url?: string;
}

export interface PriTitle {
  level: number;
}

export type CustomElementType =
  | 'paragraph'
  | 'inline'
  | 'image'
  | 'title'
  | 'upload'
  | 'list';

export type CustomElement = {
  type: CustomElementType;
  children: CustomText[];
  image?: ImageEle;
  upload?: UploadFile;
  title?: PriTitle;
};

export type CustomText = {
  text?: string;
  image?: {
    url: string;
  };
  size?: number;
  upload?: UploadFile;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export interface EditorProps {
  initialValue?: Descendant[];
  children?: React.ReactNode;
  onChange?: ((value: Descendant[]) => void) | undefined;
  value?: Descendant[];
  style?: CSSProperties;
}
