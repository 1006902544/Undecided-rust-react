import { useGetHotActivity } from '@/libs/api';
import { Col, Row, Spin } from 'antd';
import React from 'react';
import CheckMoreModalButton from './CheckMoreModalButton/CheckMoreModalButton';

export default function HotActivity() {
  const { data, isLoading, refetch } = useGetHotActivity();

  return (
    <div>
      <div className="bg-[#e6e6e6] p-[5px] indent-2 leading-8 font-bold border-l-[5px] border-[#6f77e6] flex justify-between">
        Hot Activity
        <div>
          <CheckMoreModalButton refetch={refetch} />
        </div>
      </div>

      <Spin spinning={isLoading}>
        <div className="flex content-start">
          <Row>
            {data?.data?.results?.map(({ id, cover_url }) => (
              <Col key={id} span={6}>
                <img
                  alt={id.toString()}
                  src={cover_url}
                  className="w-full h-full"
                />
              </Col>
            ))}
          </Row>
        </div>
      </Spin>
    </div>
  );
}
