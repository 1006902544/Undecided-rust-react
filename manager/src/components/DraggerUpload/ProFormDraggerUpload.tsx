import { ProForm } from '@ant-design/pro-components';
import type { ProFormItemProps } from '@ant-design/pro-components';
import type {
  DraggerProps,
  UploadChangeParam,
  UploadFile,
} from 'antd/es/upload';
import React, { useEffect, useState } from 'react';
import DraggerUpload from '.';

type UploadChange = (file: UploadFile[]) => void;

interface DraggerContainerProps extends Omit<DraggerProps, 'onChange'> {
  onChange?: UploadChange;
  value?: UploadFile<ResponseData>[];
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
  const { name } = fieldProps;

  return (
    <ProForm.Item name={name} {...props}>
      <DraggerUploadContainer {...fieldProps} />
    </ProForm.Item>
  );
}

const DraggerUploadContainer = ({
  onChange: onChangeProp,
  value,
  ...props
}: DraggerContainerProps) => {
  const [fileList, setFileList] = useState<UploadFile<ResponseData>[]>(
    value ?? []
  );

  useEffect(() => {
    onChangeProp?.(fileList.filter((item) => item.status === 'done'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  const onChange = ({
    fileList,
  }: UploadChangeParam<UploadFile<ResponseData>>) => {
    setFileList(fileList);
  };

  return <DraggerUpload onChange={onChange} fileList={fileList} {...props} />;
};
