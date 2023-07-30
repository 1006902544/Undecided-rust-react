import type { Resource } from '@/components';
import { deleteTags, getTagsLimit, updateTags } from '@/libs/api';
import type { GetTagsLimitParams, UpdateTagReq } from '@/libs/api/schema';

export const gamesCenterGeneralTagsResourceName =
  'gameCenterGeneralTagsResource';

export const gamesCenterGeneralTagsResource: Resource<GetTagsLimitParams> = {
  name: gamesCenterGeneralTagsResourceName,

  async get({ data, pagination: { page, limit } }) {
    const { data: res } = await getTagsLimit({ ...data, page, limit });
    return {
      data: res.results ?? [],
      current: res.current,
      total: res.total,
    };
  },

  async create(data: UpdateTagReq) {
    return await updateTags(data);
  },

  async check(data) {
    return data ?? {};
  },

  async update(data) {
    return await updateTags(data);
  },

  async delete({ id }) {
    return await deleteTags({ id: id as number });
  },
};
