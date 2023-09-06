import React, { useCallback } from 'react';
import {
  Editor,
  ModalButton,
  useListContext,
  useModalButtonContext,
} from '@/components';
import { Button, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { deleteComment } from '@/libs/api';

export default function CommentContentModalButton(props: {
  content: string;
  publishTime: String;
  id: number;
}) {
  return (
    <ModalButton
      label="CommentContent"
      modalProps={{ title: 'CommentContent', footer: null }}
      type="link"
    >
      <Body {...props} />
    </ModalButton>
  );
}

const Body = ({
  content,
  publishTime,
  id,
}: {
  content: string;
  publishTime: String;
  id: number;
}) => {
  const context = useListContext();
  const modalButtonContext = useModalButtonContext();

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteComment,
    onSuccess() {
      context?.refetch();
      modalButtonContext?.setOpen(false);
    },
  });

  const deleteCommentFn = useCallback(() => {
    Modal.confirm({
      onOk: () => mutate({ id, delete_type: 'logic' }),
      okText: 'Ensure',
      cancelText: 'Cancel',
      title: 'Delete',
      content:
        'are you sure to delete this comment ? \n This comment will be put in recycle bin',
    });
  }, [id, mutate]);

  return (
    <>
      <div className="border-[1px] border-[#f0f0f0] mr-[10px] rounded-[5px]">
        <Editor value={JSON.parse(content) || []} readOnly />
      </div>
      <div className=" text-[12px] mt-[12px] text-right mr-[10px] text-[gray]">
        published at: {publishTime}
      </div>
      <div className="flex justify-center mt-[32px]">
        <Button
          type="primary"
          style={{ backgroundColor: 'brown' }}
          onClick={deleteCommentFn}
          loading={isLoading}
        >
          Delete this comment
        </Button>
      </div>
    </>
  );
};
