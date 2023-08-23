import { useGetImages } from '@/libs/api';
import { Pagination } from 'antd';
import React, { useMemo, useState } from 'react';
import { CreateImageModalButton, ImageCard } from './components';
import styled from 'styled-components';

export default function ImageList() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [params] = useState({});

  const polymerization = useMemo(
    () => ({ ...pagination, ...params }),
    [pagination, params]
  );

  const reset = () => {
    if (pagination.page === 1) {
      refetch();
    } else {
      setPagination({
        page: 1,
        limit: 10,
      });
    }
  };

  const { data, refetch } = useGetImages(polymerization);

  const pageChange = (page: number, limit: number) => {
    setPagination({ page, limit });
  };

  return (
    <Container className="w-full h-full flex flex-col">
      <div className="pb-[20px]">
        <CreateImageModalButton reset={reset} />
      </div>

      <div className="flex-1 h-0 flex flex-col flex-wrap content-start overflow-x-scroll">
        {data?.data.results?.map((d) => (
          <ImageCard {...d} reset={reset} key={d.file_name} />
        ))}
      </div>

      <Pagination
        className="pt-[20px]"
        total={data?.data.total}
        current={data?.data.current}
        pageSize={pagination.limit}
        showSizeChanger
        showTotal={(total) => <span>total: {total}</span>}
        onChange={pageChange}
      />
    </Container>
  );
}

const Container = styled.div`
  .ant-pagination {
    padding-top: 20px;
    display: flex;

    .ant-pagination-total-text {
      flex: 1;
    }
  }
`;
