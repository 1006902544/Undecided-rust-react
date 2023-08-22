import { useGetImages } from '@/libs/api';
import { Button } from 'antd';
import React, { useState } from 'react';
import { ImageCard } from './components';

export default function ImageList() {
  const [pagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data } = useGetImages({ ...pagination });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="pb-[20px]">
        <Button type="primary">Create</Button>
      </div>

      <div className="flex-1 h-0 flex flex-col flex-wrap content-start">
        {data?.data.results?.map((d) => (
          <ImageCard {...d} />
        ))}
      </div>

      <div className="">total : {data?.data.total}</div>
    </div>
  );
}
