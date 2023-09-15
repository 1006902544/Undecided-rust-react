import React, { useCallback } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import SignIn from './pages/sign/sign';
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
import { OpenApiProvider } from './components/OpenApiList';
import axios from 'axios';

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

  const getOpenApi = useCallback(async () => {
    return await axios.get(
      `${process.env.REACT_APP_BASE_API_URL}/manager/api-docs/openapi.json`
    );
  }, []);

  return (
    <ConfigProvider locale={en_US}>
      <QueryClientProvider client={queryClient}>
        <OpenApiProvider getOpenApi={getOpenApi}>
          <StyleProvider
            transformers={[legacyLogicalPropertiesTransformer]}
            hashPriority="high"
          >
            <RouterProvider router={router} />
          </StyleProvider>
        </OpenApiProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
