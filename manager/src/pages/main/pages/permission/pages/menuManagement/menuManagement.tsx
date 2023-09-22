import React, {
  useState,
  createContext,
  useContext,
  Key,
  useMemo,
} from 'react';
import { RoutesLimit, Aside } from './components';
import styled from 'styled-components';
import type { Route, RoutesVecRes } from '@/libs/api/schema';
import { useGetAllRouter } from '@/libs/api';
import { Spin } from 'antd';
import type { QueryKey, UseQueryResult } from '@tanstack/react-query';
import { ErrorType } from '@/libs/api/custom_instance';
import { cloneDeep } from 'lodash';

type ContextValue = UseQueryResult<RoutesVecRes, ErrorType<unknown>> & {
  queryKey: QueryKey;
} & {
  selectedNode: PriRoute | undefined;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Key[]>>;
};

export const MenuManagementContent = createContext<ContextValue | undefined>(
  undefined
);

export const useMenuManagementContext = () => {
  const context = useContext(MenuManagementContent);
  return useMemo(() => context, [context]);
};

export interface PriRoute extends Route {
  children?: Array<PriRoute>;
}

export default function MenuManagement() {
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const allRouter = useGetAllRouter({});

  const selectedNode = useMemo<PriRoute | undefined>(() => {
    if (!selectedKeys.at(0)) {
      return undefined;
    }
    let node: PriRoute | undefined = undefined;
    const children = allRouter.data?.data?.filter((item) => {
      if (Number(item.key) === selectedKeys.at(0)) {
        node = cloneDeep(item);
      }
      return Number(item.p_key) === selectedKeys.at(0);
    });
    if (node) {
      (node as PriRoute).children = children;
    }
    return node;
  }, [selectedKeys, allRouter.data]);

  return (
    <MenuManagementContent.Provider
      value={{ ...allRouter, selectedNode, setSelectedKeys }}
    >
      <Spin spinning={allRouter.isLoading}>
        <Container className="flex w-full h-full">
          <Aside />

          <RoutesLimit />
        </Container>
      </Spin>
    </MenuManagementContent.Provider>
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
