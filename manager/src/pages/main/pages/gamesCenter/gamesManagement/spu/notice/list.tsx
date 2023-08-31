import React, { useMemo, useState } from 'react';
import { List, Table, Filter, DeleteButton } from '@/components';
import { name as resource } from './';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import type { SpuNotice } from '@/libs/api/schema';
import { Radio } from 'antd';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<SpuNotice>>(
    () => [
      {
        dataIndex: 'spu_id',
        title: 'SPU ID',
        align: 'center',
        fixed: 'left',
        width: 90,
      },
      {
        dataIndex: 'spu_name',
        title: 'SPU NAME',
        fixed: 'left',
        ellipsis: true,
      },
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
        width: 90,
      },
      {
        dataIndex: 'title',
        title: 'TITLE',
        ellipsis: true,
      },
      {
        dataIndex: 'create_time',
        title: 'CREATE TIME',
        align: 'center',
      },
      {
        dataIndex: 'update_time',
        title: 'UPDATE TIME',
        align: 'center',
      },
      {
        dataIndex: 'option',
        title: 'OPTION',
        fixed: 'right',
        align: 'center',
        render(_, { id }) {
          return (
            <div className="flex justify-center">
              <DeleteButton id={id} />
            </div>
          );
        },
      },
    ],
    []
  );

  const [publishType, setPublishType] = useState('auto');
  const [published, setPublished] = useState(0);

  return (
    <List
      resource={resource}
      filters={
        <Filter>
          <ProFormText label="SpuID" name="spu_id" />
          <ProFormText label="SpuName" name="spu_name" />
          <ProFormText label="ID" name="id" />
          <ProFormText label="Name" name="name" />
        </Filter>
      }
      actions={
        <div className=" space-x-[30px] mb-[20px]">
          <Radio.Group
            onChange={({ target: { value } }) => {
              setPublishType(value);
            }}
            options={[
              {
                label: 'Manual Publish',
                value: 'manual',
              },
              {
                label: 'Auto Publish',
                value: 'auto',
              },
            ]}
            value={publishType}
            buttonStyle="solid"
            optionType="button"
          />

          <Radio.Group
            value={published}
            onChange={({ target: { value } }) => {
              setPublished(value);
            }}
            options={[
              {
                label: 'Published',
                value: 1,
              },
              {
                label: 'Unpublished',
                value: 0,
              },
            ]}
            buttonStyle="solid"
            optionType="button"
          />
        </div>
      }
      filterValue={{
        publish_type: publishType,
        published,
      }}
    >
      <Table columns={columns} />
    </List>
  );
}
