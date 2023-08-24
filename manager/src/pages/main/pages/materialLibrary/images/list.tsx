import { useGetImages } from '@/libs/api';
import { Button, Modal, Pagination, Spin, message } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { CreateImageModalButton, ImageCard, OnCheckFn } from './components';
import styled from 'styled-components';
import { postManagerMaterialBatchDelete } from '@/libs/api/bff';

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

  const { data, refetch, isLoading } = useGetImages(polymerization);

  const pageChange = (page: number, limit: number) => {
    setCheckedFileName([]);
    setPagination({ page, limit });
  };

  const [checkedFileName, setCheckedFileName] = useState<string[]>([]);

  const onCheck: OnCheckFn = ({ file_name }, { checked }) => {
    if (checked) {
      setCheckedFileName((v) => {
        return v.concat([file_name]);
      });
    } else {
      setCheckedFileName((v) => v.filter((item) => item !== file_name));
    }
  };

  const batchDelete = useCallback(() => {
    Modal.confirm({
      type: 'warn',
      okText: 'ensure',
      cancelText: 'cancel',
      title: 'Delete',
      onOk() {
        postManagerMaterialBatchDelete({ filenames: checkedFileName }).then(
          (res) => {
            message.success(res.message);
            refetch();
            setCheckedFileName([]);
          }
        );
      },
      content: (
        <div>
          <h4>Are you sure you want to delete the following images ?</h4>
          <ul>
            {checkedFileName.map((name) => (
              <li key={name} className="items-center flex mb-[5px]">
                <i className=" flex-shrink-0 block w-[5px] h-[5px] rounded-[10px] bg-[black] mx-[10px]" />
                <span className=" flex-1  break-words inline-block break-all whitespace-normal">
                  {name}
                </span>
                <br />
              </li>
            ))}
          </ul>
        </div>
      ),
    });
  }, [checkedFileName, refetch]);

  return (
    <Container className="w-full h-full flex flex-col">
      <div className="pb-[20px] space-x-[20px]">
        <CreateImageModalButton reset={reset} />
        <Button disabled={!checkedFileName.length} onClick={batchDelete}>
          Batch Delete
        </Button>
      </div>

      <div className="flex-1 h-0">
        <Spin spinning={isLoading} size="large">
          {data?.data.results?.map((d) => (
            <ImageCard
              {...d}
              reset={reset}
              key={d.file_name}
              onCheck={onCheck}
            />
          ))}
        </Spin>
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
  .ant-spin-nested-loading {
    width: 100%;
    height: 100%;

    > div {
      width: 100%;
      height: 100%;
    }

    .ant-spin-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow-x: scroll;
    }
  }

  .ant-spin {
    width: 100%;
    height: 100%;
    max-height: 100% !important;
  }

  .ant-pagination {
    padding-top: 20px;
    display: flex;

    .ant-pagination-total-text {
      flex: 1;
    }
  }
`;
