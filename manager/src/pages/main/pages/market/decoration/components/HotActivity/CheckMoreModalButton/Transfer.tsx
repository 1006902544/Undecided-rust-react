import {
  ModalButton,
  ProFormTextNumber,
  useModalButtonContext,
} from '@/components';
import {
  deleteHotActivity,
  updateHotActivity,
  useGetActivityLimit,
  useGetHotActivity,
} from '@/libs/api';
import { ProForm } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button, Input, Modal, Pagination, Spin, message } from 'antd';
import React, { useCallback, useState } from 'react';
import hotPng from '@/assets/images/hot.png';
import type {
  GetActivityLimitParams,
  GetHotActivityParams,
} from '@/libs/api/schema';
const { Search } = Input;

export default function TransferContainer() {
  //热门活动列表
  const [hotParams, setHotParams] = useState<GetHotActivityParams>({
    page: 1,
    limit: 10,
  });

  const onHotSizeChange = useCallback((page: number, limit: number) => {
    setHotParams({ page, limit });
  }, []);

  const { data: hotActivityData, refetch: hotRefetch } =
    useGetHotActivity(hotParams);

  const { mutate: removeMutate } = useMutation({
    mutationFn: deleteHotActivity,
    onSuccess() {
      hotRefetch();
      activityRefetch();
    },
  });

  const remove = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Remove',
        content: 'Are you sure to remove this activity ?',
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk() {
          removeMutate({ id });
        },
      });
    },
    [removeMutate]
  );

  const onHotChange = useCallback((value?: string) => {
    setHotParams(({ limit }) => ({
      page: 1,
      limit,
      title: value,
    }));
  }, []);

  //活动列表
  const [activityParams, setActivityParams] = useState<GetActivityLimitParams>({
    page: 1,
    limit: 10,
  });
  const onActivitySizeChange = useCallback((page: number, limit: number) => {
    setActivityParams({ page, limit });
  }, []);

  const {
    data: ActivityData,
    isLoading: activityLoading,
    refetch: activityRefetch,
  } = useGetActivityLimit(activityParams);

  const { mutate: createMutate, isLoading: createLoading } = useMutation({
    mutationFn: updateHotActivity,
    onSuccess(res) {
      message.success(res.message);
      activityRefetch();
      hotRefetch();
    },
  });

  const onActivityChange = useCallback((value?: string) => {
    setActivityParams(({ limit }) => ({
      page: 1,
      limit,
      title: value,
    }));
  }, []);

  return (
    <div className="flex justify-betweens space-x-8">
      {/* 活动 */}
      <div className="flex-1 p-[24px] h-[600px] bg-[white] flex flex-col rounded-md">
        <h2>Activities</h2>
        <div className="my-[12px] flex">
          <Search enterButton="Search" onSearch={onActivityChange} />
        </div>
        <div className="flex-1 overflow-y-scroll pr-[12px]">
          <Spin spinning={activityLoading}>
            {ActivityData?.data?.results?.map((item) => (
              <div
                key={item.id}
                className="rounded-md px-4 flex justify-between items-center leading-10 bg-[#ebebeb] mb-2"
              >
                <span className="flex items-center">
                  {item.is_hot ? (
                    <img
                      alt=""
                      src={hotPng}
                      className="w-[18px] h-[18px] mr-[10px]"
                    />
                  ) : null}
                  {item.title}
                </span>

                <SortModalButton
                  id={item.id}
                  mutate={createMutate}
                  loading={createLoading}
                  disabled={!!item.is_hot || !item.publish_type}
                />
              </div>
            ))}
          </Spin>
        </div>
        <div>
          <Pagination
            total={ActivityData?.data.total}
            current={ActivityData?.data.current}
            onChange={onActivitySizeChange}
            showSizeChanger
          />
        </div>
      </div>

      {/* 热门 */}
      <div className="flex-1 p-[24px] h-[600px] bg-[white] flex flex-col rounded-md">
        <h2>Hot Activities</h2>
        <div className="my-[12px] flex">
          <Search enterButton="Search" onSearch={onHotChange} />
        </div>
        <div className="flex-1 overflow-y-scroll pr-[12px]">
          <Spin spinning={activityLoading}>
            {hotActivityData?.data?.results?.map((item) => (
              <div
                key={item.id}
                className="rounded-md px-4 flex justify-between items-center leading-10 bg-[#ebebeb] mb-2"
              >
                {item.title}

                <Button type="link" onClick={() => remove(item.id)}>
                  remove
                </Button>
              </div>
            ))}
          </Spin>
        </div>
        <div>
          <Pagination
            total={hotActivityData?.data.total}
            current={hotActivityData?.data.current}
            onChange={onHotSizeChange}
            showSizeChanger
          />
        </div>
      </div>
    </div>
  );
}

const SortModalButton = ({
  id,
  mutate,
  loading,
  disabled,
}: {
  id: number;
  mutate: (data: { sort: number; id: number }) => void;
  loading: boolean;
  disabled: boolean;
}) => {
  const [form] = ProForm.useForm();

  const { setOpen } = useModalButtonContext() || {};

  return (
    <ModalButton
      disabled={disabled}
      modalProps={{
        destroyOnClose: true,
        title: 'Input Sort',
        onOk() {
          form
            .validateFields()
            .then((res) => {
              mutate({ id, sort: res.sort });
            })
            .then(() => {
              setOpen?.(false);
            });
        },
        okButtonProps: {
          loading,
        },
        cancelButtonProps: {
          loading,
        },
      }}
      type="link"
      label="set hot"
    >
      <ProForm form={form} layout="horizontal" submitter={false}>
        <ProFormTextNumber
          name="sort"
          label="Sort"
          rules={[
            {
              required: true,
              message: 'please input sort',
            },
          ]}
          fieldProps={{
            precision: 0,
            min: 0,
            max: 10000,
          }}
        />
      </ProForm>
    </ModalButton>
  );
};
