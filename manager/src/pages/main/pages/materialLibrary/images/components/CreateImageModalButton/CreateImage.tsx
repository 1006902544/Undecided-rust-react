import { getToken } from '@/utils';
import { Upload, Image, Spin } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import React, { useState } from 'react';
import styled from 'styled-components';

interface ResponseData {
  data: { etag: string; fileName: string; url: string };
}

export default function CreateImage() {
  const [files, setFiles] = useState<UploadFile<ResponseData>[]>([]);

  const onChange = ({
    fileList,
  }: UploadChangeParam<UploadFile<ResponseData>>) => {
    setFiles(fileList);
  };

  return (
    <Container>
      <Upload
        action={`${process.env.REACT_APP_UPLOAD_API_URL}/manager/upload`}
        headers={{
          Authorization: getToken() ?? '',
          contentType: 'multipart/form-data',
        }}
        itemRender={() => <span></span>}
        onChange={onChange}
      >
        <div className="bg-[#3d3d3d] text-[white] rounded-[4px]">
          click to upload image
        </div>
      </Upload>

      <div className="images-container mt-[20px] flex flex-wrap">
        {files.map(({ response, status }) => (
          <div className="w-[118px] h-[118px] flex justify-center items-center">
            {status === 'done' ? (
              <Image src={response?.data.url} />
            ) : (
              <Spin spinning />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .ant-upload {
    width: 100%;
    text-align: center;
  }

  .images-container {
    .ant-spin {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    > div {
      animation: image-appear 0.3s;
      border-radius: 4px;
      box-shadow: 0 0 3px 0 #e2e2e2;
      overflow: hidden;
    }
  }

  @keyframes image-appear {
    0% {
      transform: translateX(50%);
      opacity: 0;
    }
    100% {
      transform: translateX(0%);
      opacity: 1;
    }
  }
`;
