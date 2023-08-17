import { lazy, Suspense } from 'react';

const Tags = lazy(() => import('./tags/list'));
const Types = lazy(() => import('./types/list'));
const CompanyStudio = lazy(() => import('./companyStudio/list'));
const UpdateCompanyStudio = lazy(
  () => import('./companyStudio/components/Update')
);

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
    {
      path: 'companyStudio',
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={'loading...'}>
              <CompanyStudio />
            </Suspense>
          ),
        },
        {
          path: 'create',
          element: (
            <Suspense fallback={'loading...'}>
              <UpdateCompanyStudio />
            </Suspense>
          ),
        },
        {
          path: 'edit',
          element: (
            <Suspense fallback={'loading...'}>
              <UpdateCompanyStudio />
            </Suspense>
          ),
        },
      ],
    },
  ],
};
