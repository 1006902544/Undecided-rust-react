import { DeleteButton, List, Table } from '@/components';
import { gameCenterGeneralCompanyResourceName as resource } from './';
import type { ColumnsType } from 'antd/es/table';
import type { CompanyStudio } from '@/libs/api/schema';
import { Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import qs from 'query-string';

export default function ListContainer() {
  const navigate = useNavigate();

  const goEdit = useCallback(
    (id: number) => {
      navigate({
        pathname: 'edit',
        search: qs.stringify({ id }),
      });
    },
    [navigate]
  );

  const columns: ColumnsType<CompanyStudio> = [
    {
      dataIndex: 'id',
      title: 'ID',
      align: 'center',
    },
    {
      dataIndex: 'name',
      title: 'NAME',
      ellipsis: true,
    },
    {
      dataIndex: 'logo_url',
      title: 'LOGO',
      align: 'center',
      render(v) {
        return (
          <div className="w-full h-[40px] flex justify-center">
            <div className="w-[40px] h-[40px] object-fit">
              <Image src={v} />
            </div>
          </div>
        );
      },
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
      dataIndex: 'established_time',
      title: 'ESTABLISHED TIME',
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
            <Button type="link" onClick={() => goEdit(id)}>
              EDIT
            </Button>
            <DeleteButton id={id} />
          </div>
        );
      },
    },
  ];

  return (
    <List
      resource={resource}
      actions={[
        <Button
          type="primary"
          onClick={() => {
            navigate('create');
          }}
        >
          Create
        </Button>,
      ]}
    >
      <Table columns={columns} rowKey="id" />
    </List>
  );
}
