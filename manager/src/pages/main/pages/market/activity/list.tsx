import { List, Table } from '@/components';
import React, { useCallback, useMemo } from 'react';
import { name as resource } from './';
import type { ColumnsType } from 'antd/es/table';
import type { Activity } from '@/libs/api/schema';
import { Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function ListContainer() {
  const navigate = useNavigate();

  const goEdit = useCallback(
    (id: number) => {
      navigate(`edit?id=${id}`);
    },
    [navigate]
  );

  const goCreate = useCallback(() => {
    navigate(`create`);
  }, [navigate]);

  const columns = useMemo<ColumnsType<Activity>>(
    () => [
      { dataIndex: 'id', title: 'ID', width: 90, align: 'center' },
      { dataIndex: 'title', title: 'TITLE', ellipsis: true },
      { dataIndex: 'subtitle', title: 'SUBTITLE', ellipsis: true },
      {
        dataIndex: 'cover_url',
        title: 'COVER',
        align: 'center',
        render(v) {
          return <Image src={v} height={60} />;
        },
      },
      { dataIndex: 'activity_type', title: 'ACTIVITY TYPE', align: 'center' },
      { dataIndex: 'publish_type', title: 'PUBLISH TYPE', align: 'center' },
      { dataIndex: 'publish_time', title: 'PUBLISH TIME', align: 'center' },
      { dataIndex: 'start_time', title: 'START TIME', align: 'center' },
      { dataIndex: 'end_time', title: 'END TIME', align: 'center' },
      { dataIndex: 'create_time', title: 'CREATE TIME', align: 'center' },
      {
        dataIndex: 'option',
        title: 'OPTION',
        align: 'center',
        fixed: 'right',
        render(_, { id }) {
          return (
            <div className="flex justify-center">
              <Button type="link" onClick={() => goEdit(id)}>
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [goEdit]
  );

  return (
    <List
      resource={resource}
      actions={
        <Button type="primary" onClick={goCreate}>
          CreateActivity
        </Button>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
