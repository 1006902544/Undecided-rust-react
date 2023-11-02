import type { Carousel } from '@/libs/api/schema';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import UpdateModalButton from './UpdateModalButton';
import { DeleteFilled, EditFilled, PlusCircleFilled } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { deleteCarousel } from '@/libs/api';
import { Modal, message } from 'antd';

interface IProps extends Carousel {
  refetch: () => {};
}

export default function Item({
  id,
  title,
  cover_url,
  link_url,
  subtitle,
  content,
  sort,
  refetch,
}: IProps) {
  const { mutate: deleteMutate, isLoading } = useMutation({
    mutationFn: deleteCarousel,
    onSuccess(res) {
      message.success(res.message);
      refetch?.();
    },
  });

  const onDelete = useCallback(() => {
    Modal.confirm({
      title: 'Delete Carousel',
      content: 'Are you sure to delete this carousel ?',
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk() {
        deleteMutate({ id });
      },
    });
  }, [deleteMutate, id]);

  return (
    <Container className="w-[800px] h-[400px] relative">
      <div className="controller z-[2] opacity-0 absolute right-0 top-0 p-[10px] space-x-4 bg-[rgba(0,0,0,.3)] flex justify-start border-[1px] border-[white]">
        <UpdateModalButton type="create" onSuccess={refetch}>
          <button
            className="w-[40px] h-[40px] text-[30px] flex justify-center items-center text-[white] border-[1px] border-[white]"
            disabled={isLoading}
          >
            <PlusCircleFilled />
          </button>
        </UpdateModalButton>

        <UpdateModalButton
          type="edit"
          onSuccess={refetch}
          initial={{
            id,
            title,
            cover_url,
            link_url,
            subtitle,
            content,
            sort,
          }}
        >
          <button
            className="w-[40px] h-[40px] text-[30px] flex justify-center items-center text-[white] border-[1px] border-[white]"
            disabled={isLoading}
          >
            <EditFilled />
          </button>
        </UpdateModalButton>

        <button
          className="w-[40px] h-[40px] text-[30px] flex justify-center items-center text-[white] border-[1px] border-[white]"
          onClick={onDelete}
          disabled={isLoading}
        >
          <DeleteFilled />
        </button>
      </div>

      <img alt={id.toString()} src={cover_url} className="w-full h-full" />

      <div className="z-[1] pt-[240px]  bg-gradient-to-t text-right from-[rgba(0,0,0,.7)] to-[rgba(0,0,0,0)] absolute bottom-0 left-0 h-[400px] w-full text-[white] p-[24px]">
        <div className="float-right w-[500px]">
          <h2 className="font-bold  line-clamp-1">{title}</h2>
          <p className="pl-[50px]  line-clamp-2">
            <i className=" text-[12px] text-[#cccccc]">{subtitle}</i>
          </p>
          <span className=" line-clamp-3">{content}</span>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .controller {
    transition: all 0.2s;
  }

  &:hover {
    .controller {
      opacity: 1;
    }
  }

  button {
    transition: all 0.1s;
    &:hover {
      background-color: white;
      color: black;
    }
  }
`;
