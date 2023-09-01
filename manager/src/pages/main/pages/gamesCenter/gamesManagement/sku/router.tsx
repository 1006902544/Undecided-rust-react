import { Suspense, lazy } from 'react';

const SkuManagement = lazy(() => import('./skuManagement/list'));

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
