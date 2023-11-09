import React from 'react';

export default function layout({ children }: LayoutBase) {
  return <div className="h-full p-[24px]">{children}</div>;
}
