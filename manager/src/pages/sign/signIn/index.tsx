import React, { useMemo } from 'react';
import { ByEmail, ByPassword } from './components';
import { Tabs } from 'antd';
import styled from 'styled-components';

interface TabItem {
  key: string;
  label: string;
  children?: React.ReactNode;
}

export default function SignIn() {
  const items = useMemo<TabItem[]>(
    () => [
      {
        key: 'byEmail',
        label: 'ByEmail',
        children: <ByEmail />,
      },
      {
        key: 'byPassword',
        label: 'ByPassword',
        children: <ByPassword />,
      },
    ],
    []
  );

  return (
    <Container className="mt-[50px] ml-[600px]">
      <Tabs className="mt-[50px]" items={items} centered tabPosition="left" />
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
