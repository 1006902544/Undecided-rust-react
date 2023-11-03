import { useGetHotActivity } from '@/libs/api';
import { Spin } from 'antd';
import React from 'react';
import CheckMoreModalButton from './CheckMoreModalButton/CheckMoreModalButton';
import styled from 'styled-components';

export default function HotActivity() {
  const { data, isLoading, refetch } = useGetHotActivity();

  return (
    <Container>
      <div className="bg-[#e6e6e6] p-[5px] indent-2 leading-8 font-bold border-l-[5px] border-[#6f77e6] flex justify-between">
        Hot Activity
        <div>
          <CheckMoreModalButton refetch={refetch} />
        </div>
      </div>

      <Spin spinning={isLoading}>
        <div className="flex content-start flex-wrap">
          {data?.data?.results?.map(
            ({
              id,
              cover_url,
              title,
              activity_type: type,
              price,
              discount,
            }) => (
              <div
                className="activity-container flex flex-col w-[225px] h-[150px] m-[15px] cursor-pointer"
                key={id}
              >
                <div className="w-full h-full shadow-md relative">
                  <div className="w-full h-[110px] flex-shrink-0 overflow-hidden">
                    <img
                      alt={id.toString()}
                      src={cover_url}
                      className="w-full h-full hover:scale-125 transition-all"
                    />
                  </div>

                  <div className="border-[1px] absolute right-[10px] top-[10px] text-[white] border-[white] inline-block p-[5px] w-[60px] text-center">
                    {type === 'bundle' ? (
                      <span>$ {price?.toFixed(2)}</span>
                    ) : (
                      <span>{100 - discount! * 10}% off</span>
                    )}
                  </div>

                  <h2 className="line-clamp-1 p-[5px]">{title}</h2>
                </div>
              </div>
            )
          )}
        </div>
      </Spin>
    </Container>
  );
}

const Container = styled.div`
  .activity-container {
    .activity-info {
      transition: all 0.2s;
    }

    &:hover {
      .activity-info {
      }
    }
  }
`;
