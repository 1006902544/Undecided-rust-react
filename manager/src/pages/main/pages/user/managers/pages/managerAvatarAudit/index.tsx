import type { Resource } from '@/components';
import {
  deleteManagerAvatarAudit,
  getManagerAvatarAudits,
  managerAvatarAudit,
} from '@/libs/api';

export const name = 'userManagerAvatarAuditResource';

export const userManagerAvatarAuditResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getManagerAvatarAudits({
      ...data,
      status: data.status === 'all' ? undefined : data.status,
      ...pagination,
    });
    return {
      data: res.results || [],
      total: res.total,
      current: res.current,
    };
  },

  async delete({ id }) {
    if (id) {
      return deleteManagerAvatarAudit({ id: id as number });
    }
  },

  async check(data) {
    const params = {
      ...data,
      status: data.status === 0 ? undefined : data.status,
    };
    return params;
  },

  async update(data) {
    return await managerAvatarAudit({ ...data });
  },
};
