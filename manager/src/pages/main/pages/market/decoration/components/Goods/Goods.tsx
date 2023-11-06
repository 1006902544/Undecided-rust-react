import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  type Dispatch,
} from 'react';
import SortContainer from './Sort';
import Type from './Type';
import Tag from './Tag';
import GoodsContainer from './GoodsContainer';
import type { SpuLimitSort } from '@/libs/api/schema';

interface GoodsParams {
  limit: number;
  sortBy: SpuLimitSort;
  type?: number;
  tag?: number;
}

interface GoodsContextProps extends GoodsParams {
  setParams?: Dispatch<React.SetStateAction<GoodsContextProps>>;
}

const GoodsContext = createContext<GoodsContextProps>({
  limit: 15,
  sortBy: 'time',
});

export const useGoodsContext = () => {
  const context = useContext(GoodsContext);

  return useMemo(() => context, [context]);
};

export default function Goods() {
  //参数
  const [params, setParams] = useState<GoodsParams>({
    limit: 15,
    sortBy: 'time',
  });

  return (
    <GoodsContext.Provider value={{ ...params, setParams }}>
      <div className="">
        <div className="bg-[#e6e6e6] p-[5px] indent-2 leading-8 font-bold border-l-[5px] border-[#6f77e6]">
          Goods
        </div>

        <SortContainer />

        <div className="flex space-x-4">
          <Type />
          <Tag />

          <GoodsContainer />
        </div>
      </div>
    </GoodsContext.Provider>
  );
}
