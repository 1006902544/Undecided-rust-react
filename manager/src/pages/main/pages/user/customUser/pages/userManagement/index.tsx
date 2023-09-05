import type { Resource } from '@/components';
import { getUserLimit } from '@/libs/api';

export const name = 'customUserManagementResource';

export const customUserManagementResource: Resource = {
  name,
  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getUserLimit({ ...pagination, ...data });
    return {
      data: res.results,
      current: res.current,
      total: res.total,
    };
  },
};
