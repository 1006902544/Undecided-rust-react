import React, { HTMLAttributes, useMemo } from 'react';

interface IProps extends HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function NavbarButton({
  children,
  disabled,
  style: styleProp,
  className: classNameProp,
  ...props
}: IProps) {
  const className = useMemo(() => {
    return `${classNameProp} px-[10px] py-[3px] mx-[5px] transition-all rounded-[5px]`;
  }, [classNameProp]);

  const style = useMemo(() => {
    return {
      ...styleProp,
    };
  }, [styleProp]);

  return (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  );
}
