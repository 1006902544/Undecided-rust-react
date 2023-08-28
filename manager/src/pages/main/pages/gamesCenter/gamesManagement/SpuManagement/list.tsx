import React, { useCallback, useMemo } from 'react';
import { DeleteButton, Filter, List, Table } from '@/components';
import { name as resource } from './';
import { useNavigate } from 'react-router-dom';
import { Button, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SpuLimit } from '@/libs/api/schema';
import { ProFormText } from '@ant-design/pro-components';

export default function ListContainer() {
  const navigate = useNavigate();

  const goCreate = useCallback(() => {
    navigate('create');
  }, [navigate]);

  const goEdit = useCallback(
    (id: string) => {
      navigate(`edit?id=${id}`);
    },
    [navigate]
  );

  const columns = useMemo<ColumnsType<SpuLimit>>(
    () => [
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
        dataIndex: 'cover',
        title: 'COVER',
        render({ url }) {
          return <Image src={url} height={60} />;
        },
        align: 'center',
      },
      {
        dataIndex: 'price',
        title: 'PRICE',
        align: 'center',
        render(price) {
          return <span>$ {price.toFixed(2)}</span>;
        },
      },
      {
        dataIndex: 'tags',
        title: 'TAGS',
        align: 'center',
        render(tags) {
          return (
            <div className="overflow-x-scroll flex py-[5px]">
              {tags.map((tag: string) => (
                <span
                  className=" inline-block bg-[rgba(0,0,0,.3)] px-[8px] rounded-[3px] text-[white] flex-shrink-0 mr-[20px] cursor-pointer"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        dataIndex: 'types',
        title: 'TYPES',
        align: 'center',
        render(types) {
          return (
            <div className="overflow-x-scroll flex py-[5px]">
              {types.map((type: string) => (
                <span
                  className=" inline-block bg-[rgba(0,0,0,.3)] px-[8px] rounded-[3px] text-[white] flex-shrink-0 mr-[20px] cursor-pointer"
                  key={type}
                >
                  {type}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        dataIndex: 'company',
        title: 'COMPANY',
        align: 'center',
        ellipsis: true,
        render(v) {
          return v || 'Unknown';
        },
      },
      {
        dataIndex: 'issue_time',
        align: 'center',
        title: 'ISSUE TIME',
      },
      {
        dataIndex: 'create_time',
        align: 'center',
        title: 'CREATE TIME',
      },
      {
        dataIndex: 'update_time',
        align: 'center',
        title: 'UPDATE TIME',
      },
      {
        dataIndex: 'option',
        align: 'center',
        fixed: 'right',
        title: 'OPTION',
        render(_, { id }) {
          return (
            <div className="flex justify-center">
              <Button type="link" onClick={() => goEdit(id.toString())}>
                Edit
              </Button>

              <DeleteButton id={id} />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <List
      resource={resource}
      actions={
        <Button type="primary" onClick={goCreate}>
          Create
        </Button>
      }
      filters={
        <Filter>
          <ProFormText name="id" label="ID" />
          <ProFormText name="name" label="Name" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
