import type { Key } from 'react';
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { BaseToggle } from '../../';

export interface MenuProps {
  children?: React.ReactNode;
  configs?: MenuConfig[];
}

export interface MenuListProps {
  configs?: MenuConfig[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  point: number[];
  editor: BaseEditor & ReactEditor;
}

export interface MenuConfig {
  key: Key;
  toggle?: (editor: BaseEditor & ReactEditor, info: ToggleInfo) => void;
  label?: React.ReactNode;
}

export interface ToggleInfo {
  key: Key;
  children?: React.ReactNode;
  baseToggle: BaseToggle;
}
