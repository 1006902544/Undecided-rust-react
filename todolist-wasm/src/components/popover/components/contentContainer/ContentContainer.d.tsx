import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react';
import type { PopoverAlign } from '../../';

export interface ContentContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
  align: PopoverAlign;
  className?: string;
  style?: CSSProperties;
}
