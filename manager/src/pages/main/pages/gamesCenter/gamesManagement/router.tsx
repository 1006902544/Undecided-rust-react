import { spuRouter } from './Spu/router';
import { skuRouter } from './Sku/router';

export const gameManagementRouter = {
  path: 'gamesManagement',
  children: [spuRouter, skuRouter],
};
