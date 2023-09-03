import { CreateButton, Filter, List, Table, UpdateButton } from '@/components';
import { name as resource } from './';
import { ProFormText } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import type { Sku } from '@/libs/api/schema';
import { CreateSkuNotice } from './components';
import { Image } from 'antd';

export default function ListContainer() {
  const columns = useMemo<ColumnsType<Sku>>(
    () => [
      { dataIndex: 'spu_id', title: 'SPU ID', align: 'center', width: 90 },
      { dataIndex: 'spu_name', title: 'SPU NAME', ellipsis: true },
      { dataIndex: 'id', title: 'ID', align: 'center', width: 90 },
      { dataIndex: 'name', title: 'NAME', ellipsis: true },
      {
        dataIndex: 'cover_url',
        title: 'COVER',
        align: 'center',
        render(v) {
          return <Image src={v} height={60} />;
        },
      },
      {
        dataIndex: 'price',
        title: 'PRICE',
        align: 'center',
        render(v) {
          return `$${v.toFixed(2)}`;
        },
      },
      { dataIndex: 'create_time', title: 'CREATE TIME', align: 'center' },
      { dataIndex: 'update_time', title: 'UPDATE TIME', align: 'center' },
      {
        dataIndex: 'option',
        align: 'center',
        fixed: 'right',
        render(_, { id, name }) {
          return (
            <div className="flex justify-center">
              <CreateButton
                type="link"
                meta={{ sku_id: id, sku_name: name }}
                formProps={{
                  labelCol: { flex: '90px' },
                  layout: 'horizontal',
                }}
                label="CreateNotice"
              >
                <CreateSkuNotice />
              </CreateButton>

              <UpdateButton />
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
      filters={
        <Filter>
          <ProFormText label="SpuID" name="spu_id" />
          <ProFormText label="SpuName" name="spu_name" />
          <ProFormText label="ID" name="id" />
          <ProFormText label="Name" name="name" />
        </Filter>
      }
    >
      <Table columns={columns} />
    </List>
  );
}
