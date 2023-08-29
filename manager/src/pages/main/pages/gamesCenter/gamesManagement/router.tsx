import { spuRouter } from './Spu/router';

export const gameManagementRouter = {
  path: 'gamesManagement',
  children: [spuRouter],
};
