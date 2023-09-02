import type { Resource } from '@/components';
import { getSkuLimit, updateSku } from '@/libs/api';
export { default as CheckSkuModalButton } from './CheckSkuModalButton';

export const name = 'gamesManagementSpuCheckSkuResource';

export const gamesManagementSpuCheckSkuResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSkuLimit({ ...data, ...pagination });
    return {
      data: res?.results ?? [],
      current: res?.current,
      total: res?.total,
    };
  },

  async create(data) {
    console.log(data);

    const params = {
      ...data,
      issue_time: data.issue_time.format('YYYY-MM-DD HH:mm:ss'),
      spu_id: data.spu_id.toString(),
      cover_name: data.cover.at(0).response.data.fileName,
      cover_url: data.cover.at(0).response.data.url,
      price: data.price.toFixed(2),
    };
    delete params.cover;
    return await updateSku(params);
  },
};
