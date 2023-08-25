import { Button, Image, type UploadFile } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import defaultImage from '@/assets/images/default.png';

interface IProps {
  originNode: React.ReactElement;
  file: UploadFile;
  fileList: Array<UploadFile>;
  actions: {
    download: () => void;
    preview: () => void;
    remove: () => void;
  };
}

export default function ItemRender({ file, actions }: IProps) {
  const label = useMemo(() => {
    if (file.status === 'uploading') {
      const width = (file.percent ?? 0) / 100 + '%';
      return (
        <div className="w-full">
          <div
            style={{ width }}
            className="bg-[#5252b4] h-[8px] rounded-[8px]"
          ></div>
        </div>
      );
    } else {
      return <span>{file.response?.data?.fileName || file.name}</span>;
    }
  }, [file]);

  const isError = useMemo(() => {
    return file.status === 'error' || !file.status;
  }, [file.status]);

  return (
    <Container
      className="w-full flex items-center p-[5px] border-[1px] rounded-[5px] mt-[8px]"
      style={{
        borderColor: isError ? 'brown' : undefined,
      }}
    >
      <div
        className="w-[40px] h-[40px] cursor-pointer rounded-[5px] overflow-hidden flex-shrink-0 flex justify-center items-center"
        onClick={actions.preview}
      >
        <Image
          src={isError ? defaultImage : file.response?.data?.url}
          alt={file.response?.data?.fileName || file.name}
        />
      </div>

      <div className="flex-grow px-[10px] truncate">{label}</div>

      <div className="flex-shrink-0">
        <Button type="link" onClick={actions.remove}>
          delete
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div``;
