import React from 'react';
import type { RenderElementProps } from 'slate-react';

export default function ListElement({
  children,
  attributes,
}: RenderElementProps) {
  return (
    <li style={{ paddingLeft: '20px', listStyle: 'initial' }} {...attributes}>
      {children}
    </li>
  );
}
