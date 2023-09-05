import { customRouter } from './customUser/router';

export const userRouter = {
  path: 'user',
  children: [customRouter],
};
