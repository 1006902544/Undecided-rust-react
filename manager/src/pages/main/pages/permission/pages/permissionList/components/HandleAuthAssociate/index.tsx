import type { Resource } from '@/components';
import { associate, disassociate, getPermissionAuth } from '@/libs/api';
import { AssociateAuthLimit } from '@/libs/api/schema';

export { default as HandleAuthAssociate } from './list';

export const resourceName = 'permissionHandleAuthAssociateLimitResource';

export const permissionHandleAuthAssociateLimitResource: Resource<
  any,
  AssociateAuthLimit
> = {
  name: resourceName,

  async get({ data, pagination: { page, limit } }) {
    const { data: res } = await getPermissionAuth({ ...data, page, limit });
    return {
      data: res.results ?? [],
      total: res.total,
      current: res.current,
    };
  },

  async handleStatus(data) {
    if (data.associated === 1) {
      return await disassociate(data);
    } else {
      return await associate(data);
    }
  },
};
