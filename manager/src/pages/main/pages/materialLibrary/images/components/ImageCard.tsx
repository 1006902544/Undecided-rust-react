import type { ImagesObject } from '@/libs/api/schema';
import { Button, Modal, Popover, message } from 'antd';
import type { MouseEventHandler } from 'react';
import { deleteManagerMaterialDelete } from '@/libs/api/bff';

interface IProps extends ImagesObject {
  reset?: () => void;
}

export default function ImageCard({
  file_name,
  file_url,
  e_tag,
  reset,
}: IProps) {
  const deleteImage: MouseEventHandler = async (e) => {
    Modal.confirm({
      okText: 'ok',
      cancelText: 'cancel',
      title: 'Delete',
      content: 'ensure to delete this image ?',
      onOk() {
        deleteManagerMaterialDelete({ fileName: file_name }).then((res) => {
          reset?.();
          message.success(res.message);
        });
      },
    });
  };

  return (
    <div
      className="w-[180px] h-[180px] mb-[50px] mr-[50px] p-[10px] shadow-lg hover:shadow-2xl transition-all rounded-[5px] cursor-pointer"
      key={file_name}
    >
      <Popover
        placement="rightTop"
        content={
          <div className="w-[250px] flex flex-col ">
            <div className="flex mb-[10px]">
              <span className="inline-block w-[60px] font-bold">etag:</span>
              <span className="inline-block break-words w-[190px]">
                {e_tag}
              </span>
            </div>

            <div className="flex mb-[10px]">
              <span className="inline-block w-[60px] font-bold">filename:</span>
              <span className="inline-block break-words w-[190px]">
                {file_name}
              </span>
            </div>

            <div className="flex">
              <span className="inline-block w-[60px] font-bold">fileUrl:</span>
              <span className="inline-block break-words w-[190px]">
                {file_url}
              </span>
            </div>

            <div className="flex justify-end mt-[5px]">
              <Button type="link" style={{ padding: 0 }} onClick={deleteImage}>
                Delete
              </Button>
            </div>
          </div>
        }
      >
        <img
          alt={file_name}
          src={file_url}
          className="w-full h-full object-contain rounded-[5px]"
        />
      </Popover>
    </div>
  );
}
