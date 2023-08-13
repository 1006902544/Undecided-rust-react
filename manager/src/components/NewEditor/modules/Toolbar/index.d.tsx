import { Editor } from '../index.d';

export interface ToolbarProps {
  items?: ToolbarItem[];
}

export interface ToolbarItem {
  options?: ToolbarItemOption[];
  children?: React.ReactNode;
  toggle?: ToolbarToggle;
  type?: 'click' | 'option';
}

export interface ToolbarItemOption {
  toggle?: ToolbarToggle;
  children?: React.ReactNode;
}

export type ToolbarToggle = (editor: Editor) => void;
