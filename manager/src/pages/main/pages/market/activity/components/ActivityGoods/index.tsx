import React, { useCallback, useMemo, useState } from 'react';
import { useUpdateContext } from '../UpdateContext';
import { ProForm, ProFormText, QueryFilter } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import type { ActivityGoods } from '@/libs/api/schema';
import { useGetActivityGoodsLimit } from '@/libs/api';
import { Table } from 'antd';
import DeleteButton from './DeleteButton';
import ActivityGoodsModalButton from '../ActivityGoodsModalButton';

export default function ListContainer() {
  const { data, id } = useUpdateContext();

  const {
    data: res,
    isLoading,
    refetch,
  } = useGetActivityGoodsLimit(
    {
      id: id!,
      goods_type: data?.base.activity_type!,
    },
    {
      query: {
        enabled: !!id && !!data?.base.activity_type,
      },
    }
  );

  const columns = useMemo(() => {
    const baseColumns: ColumnsType<ActivityGoods> = [
      {
        dataIndex: 'id',
        title: 'ID',
        align: 'center',
      },
      {
        dataIndex: 'spu_id',
        title: 'SPU ID',
        align: 'center',
      },
      {
        dataIndex: 'spu_name',
        title: 'SPU NAME',
        ellipsis: true,
      },
      {
        dataIndex: 'sku_id',
        title: 'SKU ID',
        align: 'center',
      },
      {
        dataIndex: 'sku_name',
        title: 'SKU NAME',
        ellipsis: true,
      },
    ];

    if (data?.base.activity_type === 'promotion') {
      baseColumns.push({
        dataIndex: 'discount',
        title: 'DISCOUNT',
        align: 'center',
      });
    }

    baseColumns.push({
      dataIndex: 'option',
      title: 'OPTION',
      align: 'center',
      fixed: 'right',
      render(_, { id, spu_id, sku_id }) {
        return (
          <div className="flex justify-center">
            <DeleteButton
              id={id}
              spu_id={spu_id}
              sku_id={sku_id as number}
              refetch={refetch}
            />
          </div>
        );
      },
    });

    return baseColumns;
  }, [data, refetch]);

  //filters
  const [filters, setFilters] = useState<{
    spu_name?: string;
    sku_name?: string;
  }>({});

  const [form] = ProForm.useForm();

  const onReset = useCallback(() => {
    setFilters({});
  }, []);

  const onSearch = useCallback(
    async (v: { spu_name?: string; sku_name?: string }) => {
      setFilters(v);
    },
    []
  );

  const dataSource = useMemo(() => {
    const data = res?.data.results ?? [];
    return data.filter(
      (item) =>
        (item.spu_name === filters.spu_name || !filters.spu_name) &&
        (item.sku_name === filters.sku_name || !filters.sku_name)
    );
  }, [res, filters]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <QueryFilter form={form} onReset={onReset} onFinish={onSearch}>
        <ProFormText name="spu_name" label="SpuName" />
        <ProFormText name="sku_name" label="SkuName" />
      </QueryFilter>

      <ActivityGoodsModalButton
        refetch={refetch}
        selected={res?.data.results || []}
      />

      <div className="flex-1">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          rowKey={({ id, spu_id, sku_id }) => `${id}-${spu_id}-${sku_id || ''}`}
        />
      </div>
    </div>
  );
}
