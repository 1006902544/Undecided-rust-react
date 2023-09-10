import { Button, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import type { Goods } from './ActivityGoods';
import type { ColumnsType } from 'antd/es/table';

interface IProps {
  selected: Goods[];
  setSelected: React.Dispatch<React.SetStateAction<Goods[]>>;
}

export default function ActivityGoodsCurrent({
  selected,
  setSelected,
}: IProps) {
  const removeGoods = useCallback(
    ({ spu_id, sku_id }: { spu_id: number; sku_id?: number | null }) => {
      setSelected((selected) =>
        selected.filter(
          (item) => item.spu_id !== spu_id || item.sku_id !== sku_id
        )
      );
    },
    [setSelected]
  );

  const columns = useMemo<ColumnsType<Goods>>(
    () => [
      { dataIndex: 'spu_id', title: 'SPU ID', width: 90, align: 'center' },
      {
        dataIndex: 'spu_name',
        title: 'SPU NAME',
        ellipsis: true,
      },
      { dataIndex: 'sku_id', title: 'SKU ID', width: 90, align: 'center' },
      {
        dataIndex: 'sku_name',
        title: 'SKU NAME',
        ellipsis: true,
      },
      {
        dataIndex: 'option',
        title: 'OPTION',
        align: 'center',
        fixed: 'right',
        render(_, { spu_id, sku_id }) {
          return (
            <div className="flex justify-center">
              <Button
                type="link"
                onClick={() => removeGoods({ spu_id, sku_id })}
              >
                DeleteFromActivity
              </Button>
            </div>
          );
        },
      },
    ],
    [removeGoods]
  );

  return (
    <div>
      <Table
        columns={columns}
        rowKey={({ spu_id, sku_id }) =>
          `${spu_id}${sku_id ? `-${sku_id}` : ''}`
        }
        dataSource={selected}
      />
    </div>
  );
}
