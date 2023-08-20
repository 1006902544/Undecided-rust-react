import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';

export type Editor = BaseEditor & ReactEditor & { type?: string };

export interface EditorContextInterface {
  editor?: Editor;
}
