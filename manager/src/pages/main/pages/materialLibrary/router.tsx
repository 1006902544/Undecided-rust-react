import { Suspense, lazy } from 'react';

const ImageList = lazy(() => import('./images/list'));

export const materialRouter = {
  path: 'materialLibrary',
  children: [
    {
      path: 'images',
      element: (
        <Suspense fallback={'...loading'}>
          <ImageList />
        </Suspense>
      ),
    },
  ],
};
