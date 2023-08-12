import type { Key } from 'react';
import type { BaseEditor } from 'slate';
import type { ReactEditor } from 'slate-react';
import type { BaseToggle } from './hooks';
import { MenuConfig } from './components/Menu/index.d';

export interface ToolbarProps {
  options?: (baseOptions: Option[]) => Option[];
}

export interface Option {
  key: Key;
  children?: React.ReactNode;
  type?: OptionTypes;
  toggle?: (edit: BaseEditor & ReactEditor, info: ToggleInfo) => void;
  configs?: MenuConfig[];
}

export interface ToggleInfo {
  key: Key;
  children?: React.ReactNode;
  baseToggle: BaseToggle;
}

export type OptionTypes = 'click' | 'menu';
