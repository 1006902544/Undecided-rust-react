import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ColorfulBgProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: React.ReactNode;
  thickness?: number;
}
