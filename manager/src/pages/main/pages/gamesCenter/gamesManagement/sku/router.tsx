import { Suspense, lazy } from 'react';

const SkuManagement = lazy(() => import('./skuManagement/list'));
const Notice = lazy(() => import('./notice/list'));

export const skuRouter = {
  path: 'skus',
  children: [
    {
      index: true,
      element: (
        <Suspense fallback="...loading">
          <SkuManagement />
        </Suspense>
      ),
    },
    {
      path: 'notice',
      element: (
        <Suspense fallback="...loading">
          <Notice />
        </Suspense>
      ),
    },
  ],
};
