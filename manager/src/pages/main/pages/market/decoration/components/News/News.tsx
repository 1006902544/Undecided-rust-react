import { deleteNews, useGetNews } from '@/libs/api';
import { Modal, Spin, message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import UpdateModalButton from './UpdateModalButton';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';

export default function News() {
  const [limit, setLimit] = useState(5);

  const { data, isLoading, refetch } = useGetNews({ limit });

  const hasMore = useMemo(
    () => data?.data.results?.length !== data?.data.total,
    [data?.data.results?.length, data?.data.total]
  );

  const { ref } = useInView({
    threshold: [1],
    initialInView: false,
    onChange(_, { isIntersecting }) {
      if (!isLoading && isIntersecting && hasMore) {
        setLimit((limit) => limit + 5);
      }
    },
  });

  const reset = useCallback(() => {
    if (limit === 5) {
      refetch();
    } else {
      setLimit(5);
    }
  }, [limit, refetch]);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteNews,
    onSuccess(res) {
      message.success(res.message);
      reset();
    },
  });

  const deleteNewsFn = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Delete news',
        content: 'Are you sure to delete this news ?',
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk() {
          deleteMutate({ id });
        },
      });
    },
    [deleteMutate]
  );

  return (
    <div>
      <div className="bg-[#e6e6e6] p-[5px] indent-2 leading-8 font-bold border-l-[5px] border-[#6f77e6] flex justify-between">
        News
        <UpdateModalButton
          type="create"
          className="mr-[12px] font-normal text-[#3180fd]"
          refresh={reset}
        >
          create
        </UpdateModalButton>
      </div>

      <div className=" max-h-[2000px] overflow-y-scroll pr-[5px]">
        <Spin spinning={isLoading}>
          <div className="flex flex-col">
            {data?.data?.results?.map((item) => (
              <div
                className="mt-4 border-[1px] border-[#cccccc] rounded-sm relative"
                key={item.id}
              >
                <div
                  className="absolute z-10 w-full h-full transition-all
                  bg-[rgba(0,0,0,.5)] text-[white] flex justify-center opacity-0 hover:opacity-100 space-x-6"
                >
                  <UpdateModalButton
                    type="edit"
                    refresh={reset}
                    initial={item}
                    className="text-[40px] hover:scale-125 transition-all"
                  >
                    <EditOutlined />
                  </UpdateModalButton>

                  <button
                    className="text-[40px] hover:scale-125 transition-all"
                    onClick={() => deleteNewsFn(item.id)}
                  >
                    <DeleteOutlined />
                  </button>
                </div>

                <h2 className="p-[5px] line-clamp-1 bg-[#e6e6e6] border-b-[1px] border-[#cccccc]">
                  {item.title}
                </h2>

                <div className="p-[10px] min-h-[100px] max-h-[200px] overscroll-y-scroll whitespace-pre-wrap">
                  {item.content}
                </div>

                <div className="p-[5px] text-right text-[gray]">
                  update at : {item.update_time}
                </div>
              </div>
            ))}
          </div>
        </Spin>

        <div className="text-center mt-6" ref={ref}>
          {isLoading ? 'loading...' : hasMore ? 'load more' : 'no more'}
        </div>
      </div>
    </div>
  );
}
