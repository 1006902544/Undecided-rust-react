import { lazy, Suspense } from 'react';

const PermissionList = lazy(() => import('./pages/permissionList/list'));
const MenuManagement = lazy(
  () => import('./pages/menuManagement/menuManagement')
);

export const permissionRouter = {
  path: 'permissions',
  children: [
    {
      index: true,
      element: (
        <Suspense fallback="loading">
          <PermissionList />
        </Suspense>
      ),
    },
    {
      path: 'menu',
      element: (
        <Suspense fallback="loading">
          <MenuManagement />
        </Suspense>
      ),
    },
  ],
};
