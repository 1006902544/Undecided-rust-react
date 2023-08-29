import { Suspense, lazy } from 'react';

const SpuManagement = lazy(() => import('./SpuManagement/list'));
const SpuUpdate = lazy(
  () => import('./SpuManagement/components/Update/Update')
);

export const spuRouter = {
  path: 'spus',
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={'...loading'}>
          <SpuManagement />
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
};
