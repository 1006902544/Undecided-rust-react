import type { Resource } from '@/components';
import { getCommentLimit } from '@/libs/api';

export const name = 'gamesCenterCommentListResource';

export const gamesCenterCommentListResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getCommentLimit({ ...data, ...pagination });
    return {
      data: res.results,
      total: res.total,
      current: res.current,
    };
  },
};
