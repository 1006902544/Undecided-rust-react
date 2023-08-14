import { BaseToggles } from '../../index.d';
import { Editor } from '../index.d';

export interface ToolbarProps {
  items?: (items: ToolbarItem[]) => ToolbarItem[];
}

export interface ToolbarItem {
  options?: ToolbarItemOption[];
  children?: React.ReactNode;
  toggle?: ToolbarToggle;
  type?: 'click' | 'option';
  key: string;
}

export interface ToolbarItemOption {
  toggle?: ToolbarToggle;
  children?: React.ReactNode;
  key: string;
}

export type ToolbarToggle = (editor: Editor, baseToggle: BaseToggles) => void;
