import type { Resource } from '@/components';
import {
  changeRolePermissionStatus,
  getManagerRolePermissions,
} from '@/libs/api';

export const name = 'managersManagementPermissionTransferResource';

export const managersManagementPermissionTransferResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const res = await getManagerRolePermissions({ ...data, ...pagination });

    return {
      data: res.data.results || [],
      total: res.data.total,
      current: res.data.current,
    };
  },

  async handleStatus(data) {
    return await changeRolePermissionStatus({
      permission_ids: data.ids,
      role_id: data.role_id,
      status: data.direct === 'left' ? 0 : 1,
    });
  },
};
