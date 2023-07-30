import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ListContextProps, ListProps } from './';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ResourceContext } from '../';
import type { Resource } from '../';
import { message } from 'antd';

export const ListContext = createContext<ListContextProps | undefined>(
  undefined
);

export default function List<Res = any>({
  resource: resourceName,
  children,
  filters,
  actions,
  filterValue,
}: ListProps) {
  const resources: Resource<Record<string, any>, Res>[] =
    useContext(ResourceContext);

  const resource = useMemo(() => {
    return resources.find((res) => res.name === resourceName);
  }, [resources, resourceName]);

  //pagination info
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  //polymerize search params
  const polymer = useMemo(() => {
    return {
      ...filterValues,
      ...pagination,
    };
  }, [filterValues, pagination]);

  //get query
  const getQuery = useQuery(
    [resource?.name, polymer, filterValue],
    () =>
      resource?.get?.({
        pagination,
        data: { ...filterValues, ...filterValue },
      }),
    {}
  );

  //delete mutation
  const deleteMutation = useMutation({
    mutationFn: resource?.delete,
    onSuccess(data) {
      message.success('delete success');
      getQuery.refetch();
    },
  });

  if (!resource) {
    return <div>Resource Are Not Found</div>;
  }

  return (
    <ListContext.Provider
      value={{
        ...getQuery,
        name: resourceName,
        pagination,
        setPagination,
        filterValues,
        setFilterValues,
        resource,
        mutations: {
          deleteMutation,
        },
      }}
    >
      <div className=" h-full flex flex-col">
        {filters}

        <div className="flex py-[10px]">{actions}</div>

        {children}
      </div>
    </ListContext.Provider>
  );
}
