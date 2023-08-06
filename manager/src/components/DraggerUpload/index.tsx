import React from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getToken } from '@/utils';
import styled from 'styled-components';
import { DraggerProps } from 'antd/es/upload';
import ItemRender from './ItemRender';
const { Dragger } = Upload;

interface IProps extends DraggerProps {}

export default function DraggerUpload(props: IProps) {
  console.log(process.env.REACT_APP_UPLOAD_API_URL);

  return (
    <UploadContainer
      action={`${process.env.REACT_APP_UPLOAD_API_URL}/manager/upload`}
      headers={{
        Authorization: getToken() ?? '',
      }}
      itemRender={(originNode, file, fileList, actions) => (
        <ItemRender
          originNode={originNode}
          file={file}
          fileList={fileList}
          actions={actions}
        />
      )}
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
