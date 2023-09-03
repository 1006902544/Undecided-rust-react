import type { Resource } from '@/components';
import { getSkuLimit, updateSkuNotice } from '@/libs/api';

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

  async create(data) {
    return await updateSkuNotice({
      ...data,
      publish_time: data.publish_time?.format('YYYY-MM-DD HH:mm:ss'),
      sku_id: data.sku_id.toString(),
    });
  },
};
