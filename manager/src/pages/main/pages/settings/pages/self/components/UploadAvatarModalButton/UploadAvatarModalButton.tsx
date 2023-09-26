import { CloudUploadOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import 'react-image-crop/src/ReactCrop.scss';
import UploadAvatar from './UploadAvatar';

interface IProps {
  children: React.ReactNode;
}

export default function UploadAvatarModalButton({ children }: IProps) {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <div className="relative">
        {children}
        <button
          className="w-full text-[24px] text-[white] h-full inline-block absolute left-0 top-0 rounded-full opacity-0 hover:opacity-100 bg-[rgba(0,0,0,.5)] transition-all"
          type="button"
          onClick={onOpen}
        >
          <CloudUploadOutlined />
        </button>
      </div>
      <Modal
        open={open}
        onCancel={onCancel}
        destroyOnClose
        footer={null}
        title={null}
        width={300}
        bodyStyle={{
          overflow: 'auto',
        }}
      >
        <UploadAvatar />
      </Modal>
    </>
  );
}
