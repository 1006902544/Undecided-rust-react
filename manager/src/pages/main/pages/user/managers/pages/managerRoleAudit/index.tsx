import type { Resource } from '@/components';
import { auditRoleApply, deleteRoleAudit, getRoleAuditLimit } from '@/libs/api';

export const name = 'managerRoleAuditResource';

export const managerRoleAuditResource: Resource = {
  name,

  async get({ data, pagination }): Promise<any> {
    const { data: res } = await getRoleAuditLimit({ ...data, ...pagination });
    return {
      data: res.results || [],
      total: res.total,
      current: res.current,
    };
  },

  async check(data) {
    return data;
  },

  async update(data) {
    return await auditRoleApply({
      id: data.id,
      status: data.status,
    });
  },

  async delete({ id }) {
    return await deleteRoleAudit({ id: id as number });
  },
};
