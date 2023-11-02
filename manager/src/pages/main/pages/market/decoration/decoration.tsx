import React from 'react';
import { Carousel, HotActivity } from './components';

export default function Decoration() {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <Carousel />

      <div className="flex mt-[24px]">
        <div className="w-[1100px]">
          <HotActivity />
        </div>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
