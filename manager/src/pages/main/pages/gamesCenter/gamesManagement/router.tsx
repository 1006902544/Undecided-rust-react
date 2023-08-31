import { spuRouter } from './spu/router';
import { skuRouter } from './sku/router';

export const gameManagementRouter = {
  path: 'gamesManagement',
  children: [spuRouter, skuRouter],
};
