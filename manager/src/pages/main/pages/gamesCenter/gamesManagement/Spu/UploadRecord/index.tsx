import type { Resource } from '@/components';
import { deleteSpuUpdateRecord, getSpuUpdateRecord } from '@/libs/api';

export const name = 'gamesManagementSpuUploadRecordResource';

export const gamesManagementSpuUploadRecordResource: Resource = {
  name,
  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getSpuUpdateRecord({ ...data, ...pagination });
    return {
      current: res?.current,
      total: res?.total,
      data: res.results ?? [],
    };
  },

  async delete({ id }): Promise<any> {
    if (id) {
      return await deleteSpuUpdateRecord({ id: id as string });
    }
  },
};
