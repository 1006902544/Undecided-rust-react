import { Button, type UploadFile } from 'antd';
import React, { useMemo } from 'react';

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

export default function ItemRender({ file, fileList, actions }: IProps) {
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
      return <span>{file.response?.data?.fileName}</span>;
    }
  }, [file]);

  return (
    <div className="w-full flex items-center p-[5px] border-[1px] rounded-[5px] mt-[8px]">
      <div
        className="w-[40px] h-[40px] bg-[gray] cursor-pointer rounded-[5px] overflow-hidden"
        onClick={actions.preview}
      >
        <img
          alt={file.response?.data?.fileName}
          src={file.response?.data?.url}
        />
      </div>

      <div className="flex-grow px-[10px]">{label}</div>

      <Button type="link" onClick={actions.remove}>
        delete
      </Button>
    </div>
  );
}
