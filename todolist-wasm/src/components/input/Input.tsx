'use client';

import React, { useMemo, useState, forwardRef } from 'react';
import type {
  CSSProperties,
  FocusEventHandler,
  InputHTMLAttributes,
} from 'react';
import './input.scss';
import type {
  FieldValues,
  FormState,
  UseFormRegisterReturn,
  UseFormWatch,
} from 'react-hook-form';

interface IProps extends Omit<InputHTMLAttributes<any>, 'style' | 'className'> {
  style?: CSSProperties;
  className?: string;
  watch?: UseFormWatch<FieldValues>;
  register?: UseFormRegisterReturn<string>;
  formState?: FormState<FieldValues>;
}

export default function Input({
  className: classNameProp,
  style,
  onFocus: onFocusProps,
  onBlur: onBlurProps,
  watch,
  register,
  formState,
  ...props
}: IProps) {
  const [isFocus, setIsFocus] = useState(false);

  const onFocus: FocusEventHandler = (e) => {
    setIsFocus(true);
    onFocusProps?.(e);
  };

  const onBlur: FocusEventHandler = (e) => {
    setIsFocus(false);
    onBlurProps?.(e);
  };

  const className = useMemo(() => {
    return `input-container w-full transition-all h-[32px] rounded-[3px]  border-[1px] border-[#ccc] ${
      classNameProp ?? ''
    } ${isFocus ? 'input-container-focus' : ''}`;
  }, [classNameProp, isFocus]);

  return (
    <div className={className} style={style}>
      <input
        {...register}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
        className={`input-content rounded-[3px] indent-[10px] w-full outline-none  h-full ${
          isFocus ? 'input-content-focus' : ''
        }`}
      />
    </div>
  );
}
