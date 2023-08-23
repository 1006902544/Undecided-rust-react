import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import SignIn from './pages/sign/signIn';
import {
  AuthRouteProvider,
  QueryResourceProvider,
  MenuProvider,
} from './components';
import Main from './pages/main/main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { mainPagesRouter } from './pages/main/pages/router';
import { resources } from './resources';
import { ConfigProvider } from 'antd';
import en_US from 'antd/locale/zh_CN';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const router = createHashRouter([
    {
      path: '/',
      element: (
        <AuthRouteProvider unless={[]}>
          <QueryResourceProvider resources={resources}>
            <MenuProvider>
              <Main />
            </MenuProvider>
          </QueryResourceProvider>
        </AuthRouteProvider>
      ),
      children: mainPagesRouter,
    },
    {
      path: 'signIn',
      element: <SignIn />,
    },
  ]);

  return (
    <ConfigProvider locale={en_US}>
      <QueryClientProvider client={queryClient}>
        <StyleProvider
          transformers={[legacyLogicalPropertiesTransformer]}
          hashPriority="high"
        >
          <RouterProvider router={router} />
        </StyleProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
