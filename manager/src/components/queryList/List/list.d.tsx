import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { DeleteFnOpt, Resource, ResourceGetRes } from '../types.d';

export interface ListProps {
  children?: React.ReactNode;
  resource: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  filterValue?: Record<string | number | symbol, any>;
}

interface ListContextBaseProps {
  name?: string;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface Mutations {
  deleteMutation: UseMutationResult<any, unknown, DeleteFnOpt<any>, unknown>;
}

export type ListContextProps<Req = any, Res = any> = ListContextBaseProps &
  UseQueryResult<ResourceGetRes<Res> | undefined, Req> & {
    setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
    pagination: Pagination;
    filterValues: Record<string, any>;
    setFilterValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    resource: Resource<Record<string, any>, Res>;
    mutations: Mutations;
  };
