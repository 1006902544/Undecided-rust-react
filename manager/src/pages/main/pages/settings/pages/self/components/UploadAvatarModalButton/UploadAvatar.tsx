import { CloudUploadOutlined, RedoOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import CropModal from './CropModal';
import { useMutation } from '@tanstack/react-query';

interface ResponseData {
  etag: string;
  fileName: string;
  url: string;
}

type PriFile = UploadFile<{ data: ResponseData }>;

export default function UploadAvatar() {
  const [waitingCrop, setWaitingCrop] = useState<
    string | ArrayBuffer | null | undefined
  >();

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

  const { mutate, isLoading } = useMutation({
    mutationFn: customRequest,
  });

  return (
    <Container className="w-full">
      <Upload
        itemRender={() => null}
        maxCount={1}
        accept={'image/*'}
        customRequest={mutate}
      >
        <div className="w-full h-full absolute rounded-[5px] overflow-hidden">
          <div className="w-full h-full bg-[rgba(0,0,0,0)] text-[#353535] absolute hover:bg-[rgba(0,0,0,.7)] hover:text-[white] transition-all flex justify-center items-center text-[50px]">
            {isLoading ? <RedoOutlined /> : <CloudUploadOutlined />}
          </div>
        </div>
      </Upload>

      <CropModal waitingCrop={waitingCrop} setWaitingCrop={setWaitingCrop} />
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
