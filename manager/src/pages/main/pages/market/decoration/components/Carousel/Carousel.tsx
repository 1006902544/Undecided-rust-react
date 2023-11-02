import { useGetCarousel } from '@/libs/api';
import { Carousel, Spin } from 'antd';
import React from 'react';
import Item from './Item';
import UpdateModalButton from './UpdateModalButton';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export default function CarouselContainer() {
  const { data, isLoading, refetch } = useGetCarousel();

  return (
    <Spin spinning={isLoading}>
      <Container className="w-[800px] h-[400px] shadow-lg">
        {isLoading || data?.data?.length === 0 ? (
          <UpdateModalButton
            type="create"
            className="w-full h-full flex justify-center flex-col items-center cursor-pointer"
            onSuccess={refetch}
          >
            <PlusOutlined className="text-[50px] mb-[20px]" />
            <h2>Click to create a carousel</h2>
          </UpdateModalButton>
        ) : (
          <Carousel>
            {data?.data?.map((item) => (
              <Item {...item} key={item.id} refetch={refetch} />
            ))}
          </Carousel>
        )}
      </Container>
    </Spin>
  );
}

const Container = styled.div`
  .ant-carousel {
    width: 800px;
    height: 400px;
  }
`;
