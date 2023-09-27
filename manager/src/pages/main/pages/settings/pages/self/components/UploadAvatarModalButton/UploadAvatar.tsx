import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import CropModal from './CropModal';
import { getToken } from '@/utils';
import axios from 'axios';

interface ResponseData {
  etag: string;
  fileName: string;
  url: string;
}

export default function UploadAvatar() {
  //handle crop
  const [waitingCrop, setWaitingCrop] = useState<
    string | ArrayBuffer | null | undefined
  >();
  const [resultCrop, setResultCrop] = useState<
    string | ArrayBuffer | null | undefined
  >();

  //handle upload
  const customRequest = useCallback(
    async (options: UploadRequestOption<any>) => {
      const reader = new FileReader();
      reader.readAsDataURL(options.file as Blob);
      reader.onload = () => {
        const src = reader.result;
        setWaitingCrop(src);
      };
    },
    []
  );

  const dataUrlToFile = useCallback((data: string | ArrayBuffer) => {
    const buffer = data?.toString().split(',');
    if (buffer) {
      const mime = buffer[0]?.match(/:(.*?);/)?.[1];
      const blob = atob(buffer?.[1]);
      let n = blob.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = blob.charCodeAt(n);
      }
      return new File([u8arr], `avatar-${Date.now()}`, { type: mime });
    }
  }, []);

  const upload = useCallback(async () => {
    const url = `${process.env.REACT_APP_UPLOAD_API_URL}/manager/upload`;
    const headers = {
      Authorization: getToken() || '',
      contentType: 'multipart/form-data',
    };
    if (resultCrop) {
      const file = dataUrlToFile(resultCrop);
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        return await axios.post(url, formData, { headers });
      }
    }
  }, [dataUrlToFile, resultCrop]);

  return (
    <Container className="w-full">
      <Upload
        itemRender={() => null}
        maxCount={1}
        accept={'image/*'}
        customRequest={customRequest}
      >
        <div className="w-full h-full absolute rounded-[5px] overflow-hidden flex justify-center items-center">
          <div className="w-full h-full bg-[rgba(0,0,0,0.4)] object-contain absolute text-[white] opacity-0 hover:opacity-100 transition-all flex justify-center items-center text-[50px]">
            <CloudUploadOutlined />
          </div>
          {resultCrop ? (
            <img src={resultCrop as string} className="w-full h-full" alt="" />
          ) : (
            <CloudUploadOutlined className="text-[50px]" />
          )}
        </div>
      </Upload>

      <Button
        type="primary"
        htmlType="button"
        className="w-full"
        onClick={upload}
      >
        Apply
      </Button>

      <CropModal
        waitingCrop={waitingCrop}
        setWaitingCrop={setWaitingCrop}
        setResultCrop={setResultCrop}
      />
    </Container>
  );
}

const Container = styled.div`
  .ant-upload-select {
    width: 100%;
    .ant-upload {
      width: 100%;
      display: block;
      padding-bottom: 100%;
      height: 0;
      position: relative;
    }
  }
`;
