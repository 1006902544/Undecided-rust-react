import { ProForm } from '@ant-design/pro-components';
import type { ProFormItemProps } from '@ant-design/pro-components';
import type {
  DraggerProps,
  UploadChangeParam,
  UploadFile,
} from 'antd/es/upload';
import DraggerUpload from '.';
import { useMemo } from 'react';

type UploadChange = (file: UploadFile[]) => void;

interface DraggerContainerProps extends Omit<DraggerProps, 'onChange'> {
  onChange?: UploadChange;
  value?: UploadFile<ResponseData>[];
  'aria-required'?: string;
}

interface IProps extends Omit<ProFormItemProps, 'onChange'> {
  fieldProps?: DraggerContainerProps;
  onChange?: UploadChange;
}

interface ResponseData {
  etag: string;
  fileName: string;
  url: string;
}

export default function ProFormDraggerUpload({
  fieldProps = {},
  ...props
}: IProps) {
  const { name, required, rules: rulesProp } = props;

  const rules = useMemo(() => {
    if (required) {
      return [
        ...(rulesProp ?? []),
        {
          validator(_: any, value: UploadFile<ResponseData>[]) {
            if (value.some((f) => f.status === 'done')) {
              Promise.resolve();
            } else {
              Promise.reject('please upload file');
            }
          },
        },
      ];
    } else {
      return rulesProp;
    }
  }, [rulesProp, required]);

  return (
    <ProForm.Item name={name} {...props} rules={rules}>
      <DraggerUploadContainer {...fieldProps} />
    </ProForm.Item>
  );
}

const DraggerUploadContainer = ({
  onChange: onChangeProp,
  value,
  ...props
}: DraggerContainerProps) => {
  const onChange = ({
    fileList,
  }: UploadChangeParam<UploadFile<ResponseData>>) => {
    onChangeProp?.(fileList);
  };

  return (
    <DraggerUpload onChange={onChange} fileList={value ?? []} {...props} />
  );
};
