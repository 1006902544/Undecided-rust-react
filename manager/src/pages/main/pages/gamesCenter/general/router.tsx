import { lazy, Suspense } from 'react';

const Tags = lazy(() => import('./tags/list'));

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
  ],
};
