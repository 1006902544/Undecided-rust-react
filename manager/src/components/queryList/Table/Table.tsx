import React, { useContext, useMemo } from 'react';
import { Pagination, Table } from 'antd';
import type { TableProps } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import { ListContext } from '../';
import styled from 'styled-components';

export default function TableContainer<R extends AnyObject = any>({
  columns: columnsProps,
  ...props
}: Omit<TableProps<R>, 'dataSource'>) {
  const listContext = useContext(ListContext);

  const columns = useMemo(() => {
    return columnsProps?.map((c) => ({
      rowSpan: 180,
      width: 180,
      onCell: () =>
        c.ellipsis
          ? {
              style: {
                maxWidth: c.width ? c.width : 180 - 32,
                overflow: 'hidden',
                whiteSpace: 'nowrap' as any,
                textOverflow: 'ellipsis',
              },
            }
          : {},
      ...c,
    }));
  }, [columnsProps]);

  if (!listContext) {
    return <div>Table Must Be Build In List Context</div>;
  }

  const { setPagination, data, isLoading } = listContext;

  return (
    <>
      <Container className="flex-1 min-h-0 relative">
        <Table<R>
          columns={columns}
          loading={isLoading}
          dataSource={data?.data}
          pagination={false}
          scroll={{
            scrollToFirstRowOnChange: true,
            x: '100%',
            y: '100%',
          }}
          {...props}
        />
      </Container>
      <Pagination
        className="w-full flex justify-end mt-[20px]"
        style={{ marginTop: 20 }}
        total={data?.total}
        current={data?.current}
        onChange={(page, limit) => {
          setPagination?.({
            page,
            limit,
          });
        }}
        showQuickJumper
        showSizeChanger
      />
    </>
  );
}

const Container = styled.div`
  .ant-table-wrapper {
    height: 100%;
    .ant-spin-nested-loading {
      height: 100%;
    }
    .ant-table-wrapper {
      height: 100%;
    }

    .ant-spin-container {
      height: 100%;
    }

    .ant-table {
      height: 100%;
      .ant-table-container {
        height: 100%;
        display: flex;
        flex-direction: column;

        .ant-table-body {
          flex: 1;
        }
      }
    }
  }
`;
