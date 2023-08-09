import type { Resource } from '@/components';
import { deleteGameType, getGameTypes, updateGameType } from '@/libs/api';

export const mainGameCenterGeneralResourceName =
  'mainGameCenterGeneralResourceName';

export const mainGameCenterGeneralResource: Resource = {
  name: mainGameCenterGeneralResourceName,

  async get({ data: req, pagination }): Promise<any> {
    const { data } = await getGameTypes({ ...req, ...pagination });
    return {
      data: data?.results ?? [],
      total: data.total,
      current: data.current,
    };
  },

  async create(data) {
    const params = { ...data };
    const fileData = data.logo.at(-1).response.data;
    params.logo = {
      e_tag: fileData.etag,
      filename: fileData.fileName,
      url: fileData.url,
    };
    return await updateGameType(params);
  },

  async update(data) {
    const params = { ...data };
    const fileData = data.logo.at(-1).response.data;
    params.logo = {
      e_tag: fileData.etag,
      filename: fileData.fileName,
      url: fileData.url,
    };
    return await updateGameType(params);
  },

  async check(data) {
    const params = {
      ...data,
    };
    params.logo = [
      {
        status: 'done',
        response: {
          data: {
            fileName: data.filename,
            url: data.logo_url,
            etag: data.e_tag,
          },
        },
      },
    ];
    return params;
  },

  async delete({ id }) {
    return await deleteGameType({ id: id as number });
  },
};
