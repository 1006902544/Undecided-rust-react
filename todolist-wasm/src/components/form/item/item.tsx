import { useForm } from 'react-hook-form';
import type {
  FieldName,
  FieldValues,
  FormState,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormWatch,
} from 'react-hook-form';
import React, { CSSProperties, cloneElement, useMemo } from 'react';
import { FormContext } from '../form';
import './item.scss';

interface IProps {
  name: string;
  children: React.ReactElement;
  title?: String;
  watch?: UseFormWatch<FieldValues>;
  register?: UseFormRegister<FieldValues>;
  formState?: FormState<FieldValues>;
  options?: RegisterOptions<FieldValues, string>;
  style?: CSSProperties;
  className?: string;
}

export const FormItem = ({ ...rest }: IProps) => {
  return (
    <FormContext.Consumer>
      {(context) => {
        return <Item {...rest} {...context} />;
      }}
    </FormContext.Consumer>
  );
};

export default function Item({
  title,
  name,
  children,
  watch,
  register,
  formState,
  options,
  style,
  className: classNameProp,
}: IProps) {
  const registe = {
    ...register?.(name, options),
  };

  const { errors } = formState ?? {};

  const cloneEle = cloneElement(children, {
    formState,
    register: registe,
  });

  const errorClass = useMemo(() => {
    return `form-item-error mt-[5px] ${
      errors?.[name] ? 'form-item-error-true' : ''
    }`;
  }, [errors?.[name]]);

  const errorMessage = useMemo(() => {
    let error = errors?.[name];
    if (error) {
      if (error.message) {
        return error.message?.toString();
      } else {
        return name + ' Found Error';
      }
    } else {
      return '';
    }
  }, [errors?.[name]]);

  const className = useMemo(() => {
    return `form-item-container w-full flex flex-col ${classNameProp ?? ''}`;
  }, [classNameProp]);

  return (
    <div className={className} style={style}>
      <div>{title}</div>
      <div>{cloneEle}</div>
      <div className={errorClass}>{errorMessage}</div>
    </div>
  );
}
