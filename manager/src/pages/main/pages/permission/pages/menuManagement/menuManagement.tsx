import React, { useState } from 'react';
import { RoutesLimit, Aside } from './components';
import styled from 'styled-components';
import type { Route } from '@/libs/api/schema';

export interface PriRoute extends Route {
  children: Array<PriRoute>;
}

export default function MenuManagement() {
  const [dataSource, setDataSource] = useState<PriRoute[]>([]);

  return (
    <Container className="flex w-full h-full">
      <Aside setDataSource={setDataSource} />
      <RoutesLimit dataSource={dataSource} />
    </Container>
  );
}

const Container = styled.div`
  .ant-tree-treenode {
    width: 100%;

    .ant-tree-node-content-wrapper {
      flex: 1;
      text-indent: 5px;
    }
  }
`;
