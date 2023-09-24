import type { RouteObject } from 'react-router-dom';
import { permissionRouter } from './permission/router';
import { gamesCenterRouter } from './gamesCenter/router';
import { materialRouter } from './materialLibrary/router';
import { userRouter } from './user/router';
import { marketRouter } from './market/router';
import { settingsRouter } from './settings/router';
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

export const mainPagesRouter: RouteObject[] = [
  {
    index: true,
    element: (
      <Result
        icon={<SmileOutlined />}
        title="Welcome to the Dashboard !"
        className="mt-[100px]"
      />
    ),
  },
  permissionRouter,
  gamesCenterRouter,
  materialRouter,
  userRouter,
  marketRouter,
  settingsRouter,
];
