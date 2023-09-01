import type { Resource } from '@/components';
import { deleteSpu, getSpuLimit, updateSpuNotice } from '@/libs/api';

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

  async create(data) {
    const params = {
      title: data.title,
      content: data.content,
      publish_type: data.publishType,
      publish_time:
        data.publishType === 'auto'
          ? data.publishTime?.format('YYYY-MM-DD HH:mm:ss')
          : undefined,
      spu_id: data.spuId.toString(),
      spu_name: data.spuName,
    };
    return await updateSpuNotice(params);
  },
};
