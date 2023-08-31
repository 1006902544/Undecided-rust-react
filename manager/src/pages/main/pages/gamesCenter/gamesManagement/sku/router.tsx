import { Suspense, lazy } from 'react';

const SkuManagement = lazy(() => import('./SkuManagement/list'));

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
  ],
};
