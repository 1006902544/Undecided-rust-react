import { useGetUserDetail } from '@/libs/api';
import { Avatar, Button, Descriptions, Modal, Segmented, Spin } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import type { DescriptionsProps } from 'antd';
import Banned from './Banned';
import { useListContext } from '@/components';
import banned from '@/assets/images/banned.png';
import ok from '@/assets/images/ok.png';

export default function DetailModalButton({ id }: { id: number }) {
  const context = useListContext();

  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    context?.refetch();
    setOpen(false);
  }, [context]);

  return (
    <>
      <Button onClick={onOpen} type="link">
        CheckDetail
      </Button>
      <Modal
        width={800}
        destroyOnClose
        footer={null}
        open={open}
        title="User Detail"
        onCancel={onCancel}
      >
        <Detail id={id} />
      </Modal>
    </>
  );
}

const Detail = ({ id }: { id: number }) => {
  const [status, setStatus] = useState<'detail' | 'banned'>('detail');

  const { data, isLoading, refetch } = useGetUserDetail({ id });

  const items = useMemo<DescriptionsProps['items']>(
    () => [
      {
        key: 'id',
        label: 'ID',
        children: data?.data.id,
        span: 1.5,
      },
      {
        key: 'gender',
        label: 'Gender',
        children:
          data?.data.gender === 0
            ? 'Unknown'
            : data?.data.gender === 1
            ? 'Male'
            : 'Female',
        span: 1.5,
      },
      {
        key: 'username',
        label: 'Username',
        children: data?.data.username,
        span: 1.5,
      },
      {
        key: 'nickname',
        label: 'Nickname',
        children: data?.data.nickname,
        span: 1.5,
      },
      {
        key: 'email',
        label: 'Email',
        children: data?.data.email,
        span: 1.5,
      },
      {
        key: 'mobile',
        label: 'Mobile',
        children: data?.data.mobile,
        span: 1.5,
      },
      {
        key: 'birthday',
        label: 'Birthday',
        children: data?.data.birthday,
        span: 1.5,
      },
      {
        key: 'regin',
        label: 'Regin',
        children: data?.data.region,
        span: 1.5,
      },
      {
        key: 'createTime',
        label: 'CreateTime',
        children: data?.data.create_time,
        span: 1.5,
      },
      {
        key: 'updateTime',
        label: 'UpdateTime',
        children: data?.data.update_time,
        span: 1.5,
      },
    ],
    [data]
  );

  const body = useMemo(() => {
    if (status === 'detail') {
      return <Descriptions bordered items={items} />;
    } else {
      return (
        <Banned
          isBanned={data?.data.is_banned === 1}
          date={data?.data.banned_date as number}
          bannedStartTime={data?.data.banned_start_time}
          reason={data?.data.banned_reason}
          refetch={refetch}
          id={id}
        />
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, status, data, id]);

  return (
    <div className="flex flex-col items-center">
      <Segmented
        options={[
          {
            label: (
              <div className="flex flex-col items-center p-[6px]">
                <Avatar src={data?.data.avatar_url} />
                UserDetail
              </div>
            ),
            value: 'detail',
          },
          {
            label: (
              <div className="flex flex-col items-center p-[6px]">
                <Avatar src={data?.data.is_banned ? banned : ok} />
                BannedStatus
              </div>
            ),
            value: 'banned',
          },
        ]}
        onChange={(v) => {
          setStatus(v as any);
        }}
        value={status}
      />

      <div className="pt-[24px]">
        <Spin spinning={isLoading}>{body}</Spin>
      </div>
    </div>
  );
};
