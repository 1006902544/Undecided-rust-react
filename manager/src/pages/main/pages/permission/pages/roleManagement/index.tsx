import type { Resource } from '@/components';
import { getManagerRoles } from '@/libs/api';

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
};
