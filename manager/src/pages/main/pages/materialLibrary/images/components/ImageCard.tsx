import type { ImagesObject } from '@/libs/api/schema';
import { Button, Modal, Popover, message } from 'antd';
import {
  useState,
  type MouseEventHandler,
  useCallback,
  useEffect,
} from 'react';
import { deleteManagerMaterialDelete } from '@/libs/api/bff';
import styled from 'styled-components';
import { Copy } from '@/components';

interface IProps extends ImagesObject {
  reset?: () => void;
  onCheck?: OnCheckFn;
}

export type OnCheckFn = (
  info: {
    file_name: string;
    file_url: string;
    e_tag: string;
  },
  opt: {
    checked: boolean;
  }
) => void;

export default function ImageCard({
  file_name,
  file_url,
  e_tag,
  reset,
  onCheck: onCheckProp,
}: IProps) {
  const deleteImage: MouseEventHandler = async () => {
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

  const [checked, setChecked] = useState(false);

  const onCheck = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  useEffect(() => {
    onCheckProp?.({ e_tag, file_name, file_url }, { checked });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Container
      className="w-[180px] h-[180px] mb-[50px] mr-[50px] p-[10px] shadow-lg hover:shadow-2xl transition-all rounded-[5px] cursor-pointer relative"
      key={file_name}
      onClick={onCheck}
    >
      <div className="w-[30px] h-[30px] absolute border-[3px] bg-[white] border-[#008cff] right-[0px] top-[0px] rounded-[4px] p-[3px]">
        <i
          className={`image-card-check-${
            checked ? 'checked' : 'unchecked'
          } block w-full h-full bg-[#008cff] rounded-[2px] transition-all`}
        ></i>
      </div>

      <Popover
        placement="rightTop"
        content={
          <div
            className="w-[250px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
              <Copy text={file_url}>
                <span className="inline-block break-words w-[190px]">
                  {file_url}
                </span>
              </Copy>
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
    </Container>
  );
}

const Container = styled.div`
  .image-card-check-unchecked {
    transform: scale(0);
  }
`;
