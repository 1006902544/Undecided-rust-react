import type { Root } from 'react-dom/client';

export interface PromptConf {
  node?: Element | DocumentFragment;
  title?: React.ReactNode;
  content?: React.ReactNode;
  appearTime?: number;
}

export interface PromptProps extends Omit<PromptConf, 'node'> {
  unmount: () => void;
}

export type PromptStatus =
  | 'appearing'
  | 'appeared'
  | 'disappearing'
  | 'disappeared';
