import { Self } from './pages';

export const settingsRouter = {
  path: 'settings',
  key: 'settings',
  label: 'Settings',
  level: 1,
  sort: 0,
  children: [
    {
      path: 'self',
      key: 'self',
      label: 'Self',
      level: 1,
      sort: 0,
      element: <Self />,
    },
  ],
};
