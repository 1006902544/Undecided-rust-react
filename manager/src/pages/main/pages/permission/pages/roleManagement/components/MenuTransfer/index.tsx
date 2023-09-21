import type { Resource } from '@/components';
import { changeRoleRouterStatus, getManagerRoleRouter } from '@/libs/api';

export const name = 'managersManagementMenuTransferResource';

export const managersManagementMenuTransferResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const res = await getManagerRoleRouter({ ...data, ...pagination });

    return {
      data: res.data.results || [],
      total: res.data.total,
      current: res.data.current,
    };
  },

  async handleStatus(data) {
    return await changeRoleRouterStatus({
      router_keys: data.keys,
      role_id: data.role_id,
      status: data.direct === 'left' ? 0 : 1,
    });
  },
};
