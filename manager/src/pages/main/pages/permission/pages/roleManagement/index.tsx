import type { Resource } from '@/components';
import {
  deleteManagerRole,
  getManagerRoles,
  updateManagerRole,
} from '@/libs/api';

export {
  managersManagementPermissionTransferResource,
  managersManagementMenuTransferResource,
} from './components';

export const name = 'permissionRoleManagementResource';
export const permissionRoleManagementResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const res = await getManagerRoles({ ...data, ...pagination });
    return {
      data: res.data.results || [],
      total: res.data.total,
      current: res.data.current,
    };
  },

  async check(data) {
    const params = { ...data };
    params.icon
      ? (params.icon = [
          {
            name: data.icon,
            url: data.icon,
            status: 'done',
            response: {
              data: {
                fileName: data.icon,
                url: data.icon,
              },
            },
          },
        ])
      : (params.icon = []);
    return params;
  },

  async update(data) {
    const params = { ...data, icon: data.icon[0]?.response?.data.url };
    return await updateManagerRole(params);
  },

  async create(data) {
    const params = { ...data, icon: data.icon[0]?.response?.data.url };
    return await updateManagerRole(params);
  },

  async delete({ id }) {
    return await deleteManagerRole({ id: id as number });
  },
};
