import { Resource, useResourceContext } from '@/components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Table, Transfer, message } from 'antd';
import type { TransferProps } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import type { TableProps } from 'antd/lib';
import { groupBy } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface IProps<T = any, B = any> extends TransferProps<T> {
  table?: TableProps<B>;
  resource: {
    name: string;
    filterValues?: Record<string, any>;
    groupKey?: string;
  };
  params?: Record<string, any>;
}

export default function TransferContainer({
  table,
  resource: resourceProp,
  params: paramsProp,
  ...props
}: IProps) {
  const rowKey = useMemo(
    () => (table?.rowKey as string) || 'key',
    [table?.rowKey]
  );

  const resourceContext = useResourceContext();

  const resource = useMemo<Resource>(() => {
    return resourceContext[resourceProp.name];
  }, [resourceContext, resourceProp]);

  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { isLoading, data, refetch } = useQuery(
    [resource?.name, pagination, resourceProp.filterValues],
    () =>
      resource?.get?.({
        pagination,
        data: { ...pagination, ...resourceProp.filterValues },
      }),
    {
      enabled: !!resource,
    }
  );

  //group by data's status
  const groupsData = useMemo(() => {
    return groupBy(data?.data || [], resourceProp.groupKey || 'status');
  }, [data?.data, resourceProp.groupKey]);

  //transfer onChange
  const { mutate, isLoading: changeLoading } = useMutation({
    mutationFn: resource?.handleStatus,
    onSuccess() {
      message.success('Update success');
      refetch();
    },
  });

  const onChange = useCallback(
    async (
      targetKeys: string[],
      direct: TransferDirection,
      moveKeys: string[]
    ) => {
      const params = { ...paramsProp };
      const keysKey = rowKey + 's';
      params[keysKey] = direct === 'left' ? moveKeys : targetKeys;
      params.direct = direct;
      mutate(params);
    },
    [mutate, paramsProp, rowKey]
  );

  return (
    <Container>
      <Transfer onChange={onChange} showSelectAll={false} {...props}>
        {({
          direction,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: transferSelectedKeys,
        }) => {
          const notSelected = direction === 'left';
          const dataSource = groupsData[notSelected ? 0 : 1];

          return (
            <div>
              <Table
                loading={isLoading || changeLoading}
                rowSelection={{
                  onSelect(row, selected) {
                    onItemSelect(row[rowKey], selected);
                  },
                  onSelectAll(selected, _, changeRows) {
                    onItemSelectAll(
                      changeRows.map((item) => item[rowKey]),
                      selected
                    );
                  },
                  selectedRowKeys: transferSelectedKeys,
                }}
                size="small"
                dataSource={dataSource ?? []}
                scroll={{
                  y: 400,
                }}
                pagination={
                  notSelected
                    ? {
                        current: data?.current,
                        total: data?.total,
                        onChange(page, limit) {
                          setPagination({ page, limit });
                        },
                      }
                    : false
                }
                {...table}
              />
            </div>
          );
        }}
      </Transfer>
    </Container>
  );
}

const Container = styled.div`
  .ant-transfer {
    .ant-transfer-list {
      background-color: white;
    }

    .ant-transfer-operation {
      .ant-btn {
        background-color: rgba(0, 0, 0, 0.5);
        width: 30px;
        height: 50px;
        color: white;
        border: 0;
      }

      .ant-btn-primary:disabled {
        opacity: 0;
      }
    }
  }

  .ant-transfer-list {
    display: flex;
    padding: 20px;
  }

  .ant-table-body {
    height: 400px;
    min-height: 400px;
  }
`;
