import { Pagination } from './';

export interface Resource<Req = any, Res = any> {
  name: string;
  get?: ResourceGet<Req, Res>;
  delete?: DeleteFn;
  check?: CheckFn;
  create?: UpdateFn;
  update?: UpdateFn;
  handleStatus?: UpdateFn;
}

export type ResourceGet<Req, Res> = (
  values: ResourceReq<Req>
) => Promise<ResourceGetRes<Res>>;

export interface ResourceGetRes<Res> {
  total?: number;
  current?: number;
  data?: Array<Res>;
}

export interface ResourceReq<Req = any> {
  data?: Req;
  pagination: Pagination;
}

export type DeleteFn<T = any> = (data: DeleteFnOpt<T>) => Promise<any>;

export interface DeleteFnOpt<T> {
  id?: string | number;
  data: T;
}

export type CheckFn<T = any> = (data: T) => Promise<any>;

export type UpdateFn<T = any> = (data: T) => Promise<any>;
