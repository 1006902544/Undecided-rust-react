import type { Resource } from '@/components';
import { getSkuNotice } from '@/libs/api';

export const name = 'gamesCenterManagementSkuNoticeResource';

export const gamesCenterManagementSkuNoticeResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSkuNotice({ ...data, ...pagination });
    return {
      data: res.results ?? [],
      current: res.current,
      total: res.total,
    };
  },
};
