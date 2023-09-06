import { commentManagementRouter } from './commentManagement/router';
import { gameManagementRouter } from './gamesManagement/router';
import { gamesCenterGeneralRouter } from './general/router';

export const gamesCenterRouter = {
  path: 'gamesCenter',
  children: [
    gamesCenterGeneralRouter,
    gameManagementRouter,
    commentManagementRouter,
  ],
};
