import type { Resource } from '@/components';
import { getManagersLimit } from '@/libs/api';

export const name = 'managerManagementResource';

export const managerManagementResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const res = await getManagersLimit({ ...data, ...pagination });

    return {
      data: res.data.results,
      total: res.data.total,
      current: res.data.current,
    };
  },
};
