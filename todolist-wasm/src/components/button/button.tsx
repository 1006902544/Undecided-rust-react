import React, { useMemo } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './button.scss';

interface IProps extends ButtonHTMLAttributes<any> {
  children: React.ReactNode;
  loading?: boolean;
}

export default function button({
  children,
  className: classNameProp,
  onClick,
  onSubmit,
  loading,
  type,
  ...props
}: IProps) {
  const className = useMemo(() => {
    return `${
      process.env.NAME
    }-btn px-[10px] py-[5px] border-[1px] rounded-[3px] ${classNameProp ?? ''}`;
  }, [classNameProp]);

  const handle_click: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!loading) {
      onClick?.(e);
    }
  };

  const handle_submit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!loading) {
      onSubmit?.(e);
    }
  };

  return (
    <button
      className={className}
      onClick={handle_click}
      {...props}
      onSubmit={handle_submit}
      type={loading ? 'button' : type}
    >
      <span className="inline-block">{loading ? 'loading' : children}</span>
    </button>
  );
}
