import React, { useCallback } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getToken } from '@/utils';
import styled from 'styled-components';
import type { DraggerProps, UploadFile } from 'antd/es/upload';
import ItemRender from './ItemRender';
import type { RcFile } from 'antd/lib/upload';
const { Dragger } = Upload;
export { default as ProFormDraggerUpload } from './ProFormDraggerUpload';
export type PriFile = UploadFile<{
  data: { etag: string; fileName: string; url: string };
}>;

const baseAllowTypes = ['image/jpeg', 'image/png'];

interface IProps extends DraggerProps {
  allowTypes?: string[];
}

export default function DraggerUpload({
  allowTypes = baseAllowTypes,
  ...props
}: IProps) {
  const beforeUpload = useCallback(
    (file: RcFile) => {
      if (!allowTypes.some((t) => t === file.type)) {
        return false;
      }
      return file;
    },
    [allowTypes]
  );

  return (
    <UploadContainer
      beforeUpload={beforeUpload}
      action={`${process.env.REACT_APP_UPLOAD_API_URL}/manager/upload`}
      headers={{
        Authorization: getToken() ?? '',
        contentType: 'multipart/form-data',
      }}
      itemRender={(originNode, file, fileList, actions) => (
        <ItemRender
          originNode={originNode}
          file={file}
          fileList={fileList}
          actions={actions}
        />
      )}
      accept={allowTypes.join(',')}
      {...props}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </UploadContainer>
  );
}

const UploadContainer = styled(Dragger)``;
