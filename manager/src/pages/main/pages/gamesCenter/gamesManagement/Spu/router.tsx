import { Suspense, lazy } from 'react';

const SpuManagement = lazy(() => import('./spuManagement/list'));
const SpuUpdate = lazy(
  () => import('./spuManagement/components/Update/Update')
);
const SpuUpdateRecord = lazy(() => import('./uploadRecord/list'));
const Notice = lazy(() => import('./notice/list'));

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
    {
      path: 'updateRecord',
      element: (
        <Suspense fallback={'...loading'}>
          <SpuUpdateRecord />
        </Suspense>
      ),
    },
    {
      path: 'notice',
      element: (
        <Suspense fallback={'...loading'}>
          <Notice />
        </Suspense>
      ),
    },
  ],
};
