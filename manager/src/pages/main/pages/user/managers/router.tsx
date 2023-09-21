import { Suspense, lazy } from 'react';

const ManagersManagement = lazy(
  () => import('./pages/managersManagement/list')
);

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
  ],
};
