import { customRouter } from './customUser/router';
import { managersManagementRouter } from './managers/router';

export const userRouter = {
  path: 'user',
  children: [customRouter, managersManagementRouter],
};
