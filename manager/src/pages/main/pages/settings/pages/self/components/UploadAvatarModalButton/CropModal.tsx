import { Button, Modal } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import 'react-image-crop/src/ReactCrop.scss';
import ReactCrop, { type Crop } from 'react-image-crop';

interface IProps {
  waitingCrop: string | ArrayBuffer | null | undefined;
  setWaitingCrop: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null | undefined>
  >;
  setResultCrop: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null | undefined>
  >;
}

export default function CropModal({
  waitingCrop,
  setWaitingCrop,
  setResultCrop,
}: IProps) {
  const onCancel = useCallback(() => {
    Modal.confirm({
      title: 'Ensure',
      content: 'Are you sure to drop this crop ?',
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk() {
        setWaitingCrop(undefined);
      },
    });
  }, [setWaitingCrop]);

  return (
    <Modal
      open={!!waitingCrop}
      onCancel={onCancel}
      title={<div className="pb-[20px]"></div>}
      footer={null}
      width={300}
      bodyStyle={{
        overflow: 'auto',
      }}
      destroyOnClose
    >
      <Crop
        waitingCrop={waitingCrop}
        setResultCrop={setResultCrop}
        setWaitingCrop={setWaitingCrop}
      />
    </Modal>
  );
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Crop = ({ waitingCrop, setResultCrop, setWaitingCrop }: IProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px', // Can be 'px' or '%'
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const imgOnload: React.ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      const width = (e.target as HTMLImageElement)?.width;
      const height = (e.target as HTMLImageElement)?.height;
      if (width && height) {
        setCrop({
          unit: 'px',
          x: 0,
          y: 0,
          width: width > height ? height : width,
          height: width > height ? height : width,
        });
      }
    },
    []
  );

  const imgRef = useRef<HTMLImageElement>(null);

  const getCurrentDataUrl = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    if (!img) return;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    ctx?.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    return canvas.toDataURL();
  }, [crop]);

  const onOk = useCallback(async () => {
    setResultCrop(getCurrentDataUrl());
    setWaitingCrop(undefined);
  }, [getCurrentDataUrl, setResultCrop, setWaitingCrop]);

  return (
    <div className="flex flex-col items-center">
      <ReactCrop crop={crop} onChange={setCrop} aspect={1}>
        <img
          src={waitingCrop as string}
          alt=""
          onLoad={imgOnload}
          ref={imgRef}
        />
      </ReactCrop>

      <Button type="primary" className="w-full mt-[20px]" onClick={onOk}>
        Ensure
      </Button>
    </div>
  );
};
