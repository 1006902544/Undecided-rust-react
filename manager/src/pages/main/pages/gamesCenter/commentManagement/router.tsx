import { Suspense, lazy } from 'react';

const CommentList = lazy(() => import('./commentList/list'));
const RecycleBin = lazy(() => import('./recycleBin/list'));

export const commentManagementRouter = {
  path: 'commentsManagement',
  children: [
    {
      path: 'comments',
      element: (
        <Suspense fallback="...loading">
          <CommentList />
        </Suspense>
      ),
    },
    {
      path: 'recycleBin',
      element: (
        <Suspense fallback="...loading">
          <RecycleBin />
        </Suspense>
      ),
    },
  ],
};
