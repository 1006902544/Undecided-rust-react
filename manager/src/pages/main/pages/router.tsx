import type { RouteObject } from 'react-router-dom';
import { permissionRouter } from './permission/router';
import { gamesCenterRouter } from './gamesCenter/router';

export const mainPagesRouter: RouteObject[] = [
  permissionRouter,
  gamesCenterRouter,
];
