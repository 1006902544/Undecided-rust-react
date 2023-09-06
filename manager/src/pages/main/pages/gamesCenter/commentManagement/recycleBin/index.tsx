import type { Resource } from '@/components';
import { getCommentLimit, recoverComment } from '@/libs/api';

export const name = 'gamesCenterCommentRecycleBinResource';

export const gamesCenterCommentRecycleBinResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getCommentLimit({ ...data, ...pagination });
    return {
      data: res.results,
      total: res.total,
      current: res.current,
    };
  },

  async handleStatus(data) {
    return await recoverComment(data);
  },
};
