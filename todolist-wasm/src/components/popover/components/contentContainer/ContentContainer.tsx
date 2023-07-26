import React, { useMemo } from 'react';
import { ContentContainerProps } from './ContentContainer.d';
import './ContentContainer.scss';

const baseName = `${process.env.NAME}-popover-container`;

export default function ContentContainer({
  children,
  align,
  style,
  className: classNameProp,
}: ContentContainerProps) {
  const className = useMemo(
    () => `p-[10px] mt-[10px] bg-[white] rounded-[5px] ${classNameProp ?? ''}`,
    [classNameProp]
  );

  const handle_click: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div
      className={`${baseName} fixed z-[1000]`}
      style={{
        minWidth: align.width,
        left: align.left,
        top: align.top,
      }}
      onClick={handle_click}
    >
      <div className={className} style={style}>
        {children}
      </div>
    </div>
  );
}
