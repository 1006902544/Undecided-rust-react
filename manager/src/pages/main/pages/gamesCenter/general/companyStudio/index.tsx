import type { Resource } from '@/components';
import { deleteCompanyStudio, getCompany } from '@/libs/api';
import type { GetCompanyParams } from '@/libs/api/schema';

export const gameCenterGeneralCompanyResourceName =
  'gameCenterGeneralCompanyResourceName';

export const gameCenterGeneralCompanyResource: Resource<GetCompanyParams> = {
  name: gameCenterGeneralCompanyResourceName,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getCompany({ ...data, ...pagination });
    return {
      data: res.results,
      total: res.total,
      current: res.current,
    };
  },

  async delete({ id }) {
    return await deleteCompanyStudio({ id: id as number });
  },
};
