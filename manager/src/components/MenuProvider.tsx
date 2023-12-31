import { useGetRouter } from '@/libs/api';
import type { UseQueryResult } from '@tanstack/react-query';
import React, { useState } from 'react';
import type { Route, RoutesVecRes } from '@/libs/api/schema';
import { getToken } from '@/utils';
import type { ErrorType } from '@/libs/api/custom_instance';
import { cloneDeep } from 'lodash';
import { mapToTree } from '@/utils';

interface IProps {
  children: React.ReactNode;
}

interface PriRoute extends Route {
  children?: Array<PriRoute>;
}

export const MenuContext = React.createContext<
  | (UseQueryResult<RoutesVecRes, ErrorType<unknown>> & {
      routesTree: PriRoute[];
    })
  | null
>(null);

export default function MenuProvider({ children }: IProps) {
  const [routesTree, setRoutesTree] = useState<PriRoute[]>([]);

  const routesQuery = useGetRouter({
    query: {
      enabled: !!getToken(),
      onSuccess(data) {
        setRoutesTree(
          mapToTree({ data: data.data, fieldProps: { pkey: 'p_key' } })
        );
      },
    },
  });

  return (
    <MenuContext.Provider
      value={{
        ...routesQuery,
        routesTree,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}
