import React, { useMemo } from 'react';
import type { ColorfulBgProps } from './';
import './colorfulBg.scss';

export default function ColorfulBg({
  children,
  className: classNameProp,
  thickness = 2,
  ...props
}: ColorfulBgProps) {
  const className = useMemo(() => {
    return `colorful-bg-container-bg ${classNameProp ?? ''}`;
  }, [classNameProp]);

  return (
    <div className="colorful-bg-container" {...props}>
      <div
        className={className}
        style={{
          width: `calc(100% + ${thickness * 2}px)`,
          height: `calc(100% + ${thickness * 2}px)`,
          left: -thickness,
          top: -thickness,
        }}
      >
        <div></div>
      </div>
      {children}
    </div>
  );
}
