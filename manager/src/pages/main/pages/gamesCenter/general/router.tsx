import { lazy, Suspense } from 'react';

const Tags = lazy(() => import('./tags/list'));
const Types = lazy(() => import('./types/list'));

export const gamesCenterGeneralRouter = {
  path: 'general',
  children: [
    {
      path: 'tags',
      element: (
        <Suspense fallback={'loading...'}>
          <Tags />
        </Suspense>
      ),
    },
    {
      path: 'types',
      element: (
        <Suspense fallback={'loading...'}>
          <Types />
        </Suspense>
      ),
    },
  ],
};
