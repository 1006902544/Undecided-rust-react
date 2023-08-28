import type { Resource } from '@/components';
import { deleteSpu, getSpuLimit } from '@/libs/api';

export const name = 'gameCenterSpuManagementResourceName';

export const gameCenterSpuManagementResource: Resource = {
  name,
  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSpuLimit({ ...data, ...pagination });
    return {
      data: res?.results,
      current: res.current,
      total: res.total,
    };
  },

  async delete({ id }) {
    return await deleteSpu({ id: id?.toString() ?? '' });
  },
};
