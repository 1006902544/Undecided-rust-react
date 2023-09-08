import type { Resource } from '@/components';
import { getActivityLimit } from '@/libs/api';
export { marketActivityUpdateGoodsResource } from './components/ActivityGoods';

export const name = 'marketActivityResource';

export const marketActivityResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getActivityLimit({ ...data, ...pagination });
    return {
      data: res.results,
      current: res.current,
      total: res.total,
    };
  },
};
