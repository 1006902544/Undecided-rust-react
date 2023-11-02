import { Suspense, lazy } from 'react';

const Activity = lazy(() => import('./activity/list'));
const Update = lazy(() => import('./activity/components/Update/index'));
const Decoration = lazy(() => import('./decoration/decoration'));

export const marketRouter = {
  path: 'market',
  children: [
    {
      path: 'activity',
      children: [
        {
          index: true,
          element: (
            <Suspense fallback="...loading">
              <Activity />
            </Suspense>
          ),
        },
        {
          path: 'create',
          element: (
            <Suspense fallback="...loading">
              <Update />
            </Suspense>
          ),
        },
        {
          path: 'edit',
          element: (
            <Suspense fallback="...loading">
              <Update />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: 'decoration',
      element: (
        <Suspense fallback="...loading">
          <Decoration />
        </Suspense>
      ),
    },
  ],
};
