import type { Resource } from '@/components';
import { getSpuNotice } from '@/libs/api';

export const name = 'gamesCenterManagementSpuNoticeResource';

export const gamesCenterManagementSpuNoticeResource: Resource = {
  name,
  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSpuNotice({ ...data, ...pagination });
    return {
      data: res?.results ?? [],
      current: res?.current,
      total: res?.total,
    };
  },

  async check(data) {
    return data;
  },
};
