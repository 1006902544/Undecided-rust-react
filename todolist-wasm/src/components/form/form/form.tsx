'use client';
import React, { createContext } from 'react';
import { useForm } from 'react-hook-form';
import type { CSSProperties } from 'react';
import type {
  FieldValues,
  FormState,
  SubmitHandler,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

interface FormContext {
  watch?: UseFormWatch<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  formState?: FormState<FieldValues>;
}

export const FormContext = createContext({});

interface IProps<F> {
  children?: React.ReactNode;
  onSubmit?: (data: F) => void;
  className?: string;
  style?: CSSProperties;
}

export default function Form<F extends FieldValues = any>({
  children,
  onSubmit: onSubmitProps,
  className,
  style,
}: IProps<F>) {
  const { watch, handleSubmit, register, formState } = useForm();

  const onSubmit: SubmitHandler<F> = (data) => {
    onSubmitProps?.(data);
  };

  return (
    <FormContext.Provider
      value={{
        register,
        watch,
        formState,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className={className}
        style={style}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
