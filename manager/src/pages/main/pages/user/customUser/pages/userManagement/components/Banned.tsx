import { ProFormTextNumber } from '@/components';
import { bannedUser, unblockUser } from '@/libs/api';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import React, { useCallback, useMemo } from 'react';

interface IProps {
  isBanned: boolean;
  date?: number;
  bannedStartTime?: string;
  id: number;
  reason?: string | null;
  refetch: () => void;
}

export default function Banned({
  isBanned,
  date,
  bannedStartTime,
  id,
  refetch,
  reason,
}: IProps) {
  const [form] = ProForm.useForm();

  //封号
  const { mutate: bannedMutate, isLoading: bannedLoading } = useMutation({
    mutationFn: bannedUser,
    onSuccess() {
      refetch();
    },
  });

  const onFinish = useCallback(
    async ({ date, reason }: any) => {
      Modal.confirm({
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk: () => bannedMutate({ date: Number(date), id, reason }),
        title: 'Ensure',
        content: 'Are you sure to ban this user ?',
      });
    },
    [id, bannedMutate]
  );

  //解封
  const { mutate: unblockMutate, isLoading: unblockLoading } = useMutation({
    mutationFn: unblockUser,
    onSuccess() {
      refetch();
    },
  });

  const unblock = useCallback(() => {
    Modal.confirm({
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk: () => unblockMutate({ id }),
      title: 'Ensure',
      content: 'Are you sure to unblock this user ?',
    });
  }, [id, unblockMutate]);

  const body = useMemo(() => {
    if (isBanned && date && bannedStartTime) {
      return (
        <div className="flex flex-col w-[300px]">
          <div className="flex">
            <span className="inline-block w-[120px] font-semibold text-right">
              BannedDate:
            </span>
            <span className="inline-block flex-1 pl-[12px]">{date} day</span>
          </div>
          <div className="flex">
            <span className="inline-block w-[120px] font-semibold text-right">
              BannedStartTime:
            </span>
            <span className="inline-block flex-1 pl-[12px]">
              {bannedStartTime}
            </span>
          </div>
          <div className="flex">
            <span className=" inline-block w-[120px] font-semibold text-right">
              Reason:
            </span>
            <span className="inline-block flex-1 pl-[12px]">{reason}</span>
          </div>

          <div className="flex justify-center my-[24px]">
            <Button
              type="primary"
              onClick={unblock}
              className="w-[160px]"
              loading={unblockLoading}
            >
              Unblock
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-[400px] items-center">
          <span className="mb-[24px]">Current user isn't banned</span>

          <ProForm
            onFinish={onFinish}
            layout="horizontal"
            form={form}
            submitter={{
              render() {
                return (
                  <div className="flex justify-center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-[160px]"
                      style={{ background: 'brown' }}
                      loading={bannedLoading}
                    >
                      Banned
                    </Button>
                  </div>
                );
              },
            }}
            className="w-full"
          >
            <ProFormTextNumber
              label="Date"
              name="date"
              fieldProps={{ min: 1, max: 9999, precision: 0 }}
              rules={[{ required: true, message: 'please input banned date' }]}
            />

            <ProFormTextArea
              label="Reason"
              name="reason"
              fieldProps={{
                maxLength: 200,
                showCount: true,
              }}
            />
          </ProForm>
        </div>
      );
    }
  }, [
    isBanned,
    date,
    bannedStartTime,
    reason,
    unblock,
    unblockLoading,
    onFinish,
    form,
    bannedLoading,
  ]);

  return <div>{body}</div>;
}
