import { Suspense, lazy } from 'react';

const UserManagement = lazy(() => import('./pages/userManagement/list'));

export const customRouter = {
  path: 'customUser',
  children: [
    {
      path: 'userManagement',
      element: (
        <Suspense fallback="loading...">
          <UserManagement />
        </Suspense>
      ),
    },
  ],
};
