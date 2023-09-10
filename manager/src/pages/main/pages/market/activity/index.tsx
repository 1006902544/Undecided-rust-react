import type { Resource } from '@/components';
import { getActivityLimit } from '@/libs/api';
export { marketActivityGoodsModalButtonResource } from './components/ActivityGoodsModalButton';

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
