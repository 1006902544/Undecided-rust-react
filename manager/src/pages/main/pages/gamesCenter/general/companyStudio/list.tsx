import { List, Table } from '@/components';
import { gameCenterGeneralCompanyResourceName as resource } from './';
import type { ColumnsType } from 'antd/es/table';
import type { CompanyStudio } from '@/libs/api/schema';
import { Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function ListContainer() {
  const navigate = useNavigate();

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
      <Table columns={columns} />
    </List>
  );
}
