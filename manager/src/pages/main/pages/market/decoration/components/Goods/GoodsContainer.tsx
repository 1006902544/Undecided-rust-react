import { Col, Row, Spin } from 'antd';
import React, { type MouseEventHandler, useCallback } from 'react';
import { useGoodsContext } from './Goods';
import { useGetSpuLimit } from '@/libs/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function GoodsContainer() {
  const { limit, tag, type, sortBy } = useGoodsContext();
  const { data, isLoading } = useGetSpuLimit({
    limit,
    tag_id: tag,
    type_id: type,
    sort: sortBy,
    order: sortBy === 'time' ? 'ASC' : 'DESC',
  });

  const navigate = useNavigate();

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const value = e.currentTarget.dataset.value;
      if (value) {
        const id = Number(value);
        navigate(`/gamesCenter/gamesManagement/spus/edit?id=${id}`);
      }
    },
    [navigate]
  );

  return (
    <div className="flex-1">
      <Spin spinning={isLoading}>
        <Row gutter={[10, 10]}>
          {data?.data.results?.map(
            ({ cover, name, price, tags, types, id }) => (
              <ColContainer span={6} key={id}>
                <div
                  className="card-container w-full h-[170px] rounded overflow-hidden shadow-md flex flex-col relative cursor-pointer"
                  onClick={onClick}
                  data-value={id}
                >
                  <div className="w-full h-[100px] flex-shrink-0 overflow-hidden">
                    <img
                      alt=""
                      src={cover.url}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 p-[5px] line-clamp-1 ">
                    <h2>{name}</h2>
                  </div>

                  <div className="h-[30px] p-[5px] pr-3 text-right">
                    {price === 0 ? 'free now' : `$ ${price}`}
                  </div>

                  <div className="type-and-tag translate-y-full w-full text-[white] absolute space-y-1 bottom-0 z-10 h-[70px] rounded flex flex-col justify-center px-[10px] bg-[rgba(0,0,0,.8)]">
                    <div className="w-full line-clamp-1 space-x-2">
                      <span className=" mr-[5px]">Type:</span>
                      {types.map((item) => (
                        <span
                          className="border-[1px] border-[white] px-[5px] rounded-sm"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className=" line-clamp-1 space-x-2">
                      <span className=" mr-[5px]">Tags:</span>
                      {tags.map((item) => (
                        <span
                          className="w-full border-[1px] border-[white] px-[5px]  rounded-sm"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ColContainer>
            )
          )}
        </Row>
      </Spin>
    </div>
  );
}

const ColContainer = styled(Col)`
  .card-container {
    img,
    .type-and-tag {
      transition: all 0.2s;
    }

    &:hover img {
      transform: scale(1.2);
    }

    &:hover .type-and-tag {
      transform: translateY(0);
    }
  }
`;
