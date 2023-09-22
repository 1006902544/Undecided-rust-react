import { useGetCurrentRoleRouter } from '@/libs/api';
import type { UseQueryResult } from '@tanstack/react-query';
import React, { useContext, useMemo, useState } from 'react';
import type { Route, RoutesVecRes } from '@/libs/api/schema';
import { getToken } from '@/utils';
import type { ErrorType } from '@/libs/api/custom_instance';
import { mapToTree } from '@/utils';

interface IProps {
  children: React.ReactNode;
}

interface PriRoute extends Omit<Route, 'key'> {
  children?: Array<PriRoute>;
  key: React.Key;
}

export const MenuContext = React.createContext<
  | (UseQueryResult<RoutesVecRes, ErrorType<unknown>> & {
      routesTree: PriRoute[];
    })
  | null
>(null);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  return useMemo(() => context, [context]);
};

export default function MenuProvider({ children }: IProps) {
  const [routesTree, setRoutesTree] = useState<PriRoute[]>([]);

  const routesQuery = useGetCurrentRoleRouter({
    query: {
      enabled: !!getToken(),
      onSuccess(data) {
        setRoutesTree(
          mapToTree({
            data: data.data,
            fieldProps: { pkey: 'p_key' },
          })
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
