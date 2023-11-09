import type { SpinnerProps } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';
import React from 'react';

interface IProps extends SpinnerProps {
  children?: React.ReactNode;
  loading?: boolean;
}

export default function Spin({
  children,
  loading,
  className,
  ...props
}: IProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full h-full z-10 absolute left-0 top-0 flex justify-center items-center"
        style={{
          display: loading === true ? undefined : 'none',
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      >
        <Spinner {...props}></Spinner>
      </div>
      {children}
    </div>
  );
}
