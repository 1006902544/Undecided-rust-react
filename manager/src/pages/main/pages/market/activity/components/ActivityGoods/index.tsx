import type { Resource } from '@/components';
import { getActivityGoodsLimit } from '@/libs/api';

export const name = 'marketActivityUpdateGoodsResource';

export const marketActivityUpdateGoodsResource: Resource = {
  name,
  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getActivityGoodsLimit({
      ...data,
      ...pagination,
    });
    return {
      data: res?.results,
      current: res?.current,
      total: res?.total,
    };
  },
};
