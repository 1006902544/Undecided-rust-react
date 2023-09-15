import { Tabs } from 'antd';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import SignIn from './signIn';
import SignUp from './signUp';

interface TabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
}

export default function Sign() {
  const items = useMemo<TabItem[]>(
    () => [
      {
        key: 'signIn',
        label: 'SignIn',
        children: <SignIn />,
      },
      {
        key: 'signUp',
        label: 'SignUp',
        children: <SignUp />,
      },
    ],
    []
  );

  return (
    <Container className="w-[100vw] h-[100vh]">
      <Tabs
        className="mt-[50px]"
        items={items}
        centered
        destroyInactiveTabPane
      />
    </Container>
  );
}

const Container = styled.div`
  .ant-tabs-tab {
    width: 150px;
    .ant-tabs-tab-btn {
      width: 100%;
      text-align: center;
    }
  }
`;
