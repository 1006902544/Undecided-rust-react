import { Filter, List, StatusButton, Table } from '@/components';
import React, { useMemo, useState } from 'react';
import { name as resource } from './';
import type { ColumnsType } from 'antd/es/table';
import type { Comment } from '@/libs/api/schema';
import { CommentContentModalButton } from './components';
import { Radio } from 'antd';
import { ProFormText } from '@ant-design/pro-components';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<Comment>>(
    () => [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'user_id',
        title: 'USER ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'username',
        title: 'USERNAME',
        ellipsis: true,
      },
      {
        dataIndex: 'nickname',
        title: 'NICKNAME',
        ellipsis: true,
      },
      {
        dataIndex: 'spu_id',
        title: 'SPU ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'spu_name',
        title: 'SPU NAME',
        ellipsis: true,
      },
      {
        dataIndex: 'like',
        title: 'LIKE COUNT',
        align: 'center',
      },
      {
        dataIndex: 'dislike',
        title: 'DISLIKE COUNT',
        align: 'center',
      },
      {
        dataIndex: 'create_time',
        title: 'PUBLISH TIME',
        align: 'center',
      },
      {
        dataIndex: 'option',
        title: 'OPTION',
        align: 'center',
        fixed: 'right',
        width: 260,
        render(_, { content, create_time, id }) {
          return (
            <div className="flex justify-center">
              <CommentContentModalButton
                content={content}
                publishTime={create_time}
                id={id}
              />
              <StatusButton
                data={{ id }}
                confirmProps={{
                  title: 'Recover',
                  content: 'Are you sure to recover this comment ?',
                }}
              >
                Recover
              </StatusButton>
            </div>
          );
        },
      },
    ],
    []
  );

  const [commentType, setCommentType] = useState<'normal' | 'reply'>('normal');

  return (
    <List
      resource={resource}
      filterValue={{
        comment_type: commentType,
        status: 'delete',
      }}
      actions={
        <Radio.Group
          options={[
            { label: 'Normal', value: 'normal' },
            { label: 'Reply', value: 'reply' },
          ]}
          value={commentType}
          buttonStyle="solid"
          optionType="button"
          onChange={(e) => {
            setCommentType(e.target.value);
          }}
        />
      }
      filters={
        <Filter>
          <ProFormText name="id" label="ID" />
          <ProFormText name="user_id" label="UserID" />
          <ProFormText name="spu_id" label="SpuID" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
