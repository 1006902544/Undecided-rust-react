import type { Key } from 'react';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { BaseToggle } from './components';

export interface ToolbarProps {
  options?: (baseOptions: Option[]) => Option[];
}

export interface Option {
  key: Key;
  children?: React.ReactNode;
  toggle?: (edit: BaseEditor & ReactEditor, info: ToggleInfo) => void;
}

export interface ToggleInfo {
  key: Key;
  children?: React.ReactNode;
  baseToggle: BaseToggle;
}
