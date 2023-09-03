import type { Resource } from '@/components';
import { deleteSkuNotice, getSkuNotice } from '@/libs/api';

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

  async delete({ id }) {
    if (id) {
      return await deleteSkuNotice({ id: id as string });
    }
  },
};
