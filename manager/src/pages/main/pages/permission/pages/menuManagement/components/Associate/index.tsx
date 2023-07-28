import type { Resource } from '@/components';
import { associateAuthRouter, getAuthWithRouter } from '@/libs/api';
import type {
  AssociateRouterAuthReq,
  GetAuthWithRouterParams,
} from '@/libs/api/schema';
export { default as AssociateModalButton } from './AssociateModalButton';

export const permissionsMenuRouterAssociateResourceName =
  'permissionsMenuRouterAssociateResourceName';

export const permissionsMenuRouterAssociateResource: Resource<GetAuthWithRouterParams> =
  {
    name: permissionsMenuRouterAssociateResourceName,

    async get({ pagination: { page, limit }, data }) {
      const { data: res } = await getAuthWithRouter({ page, limit, ...data });
      return {
        data: res?.results ?? [],
        total: res.total,
        current: res.current,
      };
    },

    async handleStatus(data: AssociateRouterAuthReq) {
      return await associateAuthRouter(data);
    },
  };
