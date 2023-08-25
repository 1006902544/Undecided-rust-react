import { Suspense, lazy } from 'react';

const Spu = lazy(() => import('./SpuManagement/list'));
const SpuUpdate = lazy(
  () => import('./SpuManagement/components/Update/Update')
);

export const gameManagementRouter = {
  path: 'gamesManagement',
  children: [
    {
      path: 'spus',
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={'...loading'}>
              <Spu />
            </Suspense>
          ),
        },
        {
          path: 'create',
          element: (
            <Suspense fallback={'...loading'}>
              <SpuUpdate />
            </Suspense>
          ),
        },
        {
          path: 'edit',
          element: (
            <Suspense fallback={'...loading'}>
              <SpuUpdate />
            </Suspense>
          ),
        },
      ],
    },
  ],
};
