import type { Resource } from '@/components';
import { deletePermission, getPermission, updatePermission } from '@/libs/api';
import type { GetPermissionParams } from '@/libs/api/schema';

export const permissionListResourceName = 'permissionListResource';

export const permissionListResource: Resource<GetPermissionParams> = {
  name: permissionListResourceName,

  async get({ pagination, data }) {
    const { data: res } = await getPermission({ ...data, ...pagination });
    return {
      data: res?.results ?? [],
      total: res?.total,
      current: res?.current,
    };
  },

  async delete({ id }) {
    return deletePermission({ id: id as number });
  },

  async check(data) {
    return data ?? {};
  },

  async update(data) {
    return await updatePermission(data);
  },

  async create(data) {
    return await updatePermission(data);
  },
};
