import { Suspense, lazy } from 'react';

const ManagersManagement = lazy(
  () => import('./pages/managersManagement/list')
);
const RoleAudit = lazy(() => import('./pages/managerRoleAudit/list'));
const AvatarAudit = lazy(() => import('./pages/managerAvatarAudit/list'));

export const managersManagementRouter = {
  path: 'managers',
  children: [
    {
      path: 'managersManagement',
      element: (
        <Suspense fallback="loading...">
          <ManagersManagement />
        </Suspense>
      ),
    },
    {
      path: 'roleAudit',
      element: (
        <Suspense fallback="loading...">
          <RoleAudit />
        </Suspense>
      ),
    },
    {
      path: 'avatarAudit',
      element: (
        <Suspense fallback="loading...">
          <AvatarAudit />
        </Suspense>
      ),
    },
  ],
};
