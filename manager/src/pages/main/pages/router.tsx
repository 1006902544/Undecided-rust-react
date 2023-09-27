import type { RouteObject } from 'react-router-dom';
import { permissionRouter } from './permission/router';
import { gamesCenterRouter } from './gamesCenter/router';
import { materialRouter } from './materialLibrary/router';
import { userRouter } from './user/router';
import { marketRouter } from './market/router';
import { settingsRouter } from './settings/router';
import Main from './main';

export const mainPagesRouter: RouteObject[] = [
  {
    index: true,
    element: <Main />,
  },
  permissionRouter,
  gamesCenterRouter,
  materialRouter,
  userRouter,
  marketRouter,
  settingsRouter,
];
