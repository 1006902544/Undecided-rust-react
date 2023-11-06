import React from 'react';
import { Carousel, Goods, HotActivity, News } from './components';

export default function Decoration() {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <Carousel />

      <div className="flex mt-[24px]">
        <div className="w-[1100px] flex-shrink-0">
          <HotActivity />

          <Goods />
        </div>

        <div className="flex-1 mx-8">
          <News />
        </div>
      </div>
    </div>
  );
}
