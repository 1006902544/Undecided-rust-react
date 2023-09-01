import type { Resource } from '@/components';
import { getSkuLimit } from '@/libs/api';

export const name = 'gamesCenterSkuManagementResource';

export const gamesCenterSkuManagementResource: Resource = {
  name,
  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSkuLimit({ ...data, ...pagination });

    return {
      data: res.results ?? [],
      current: res.current,
      total: res.total,
    };
  },
};
