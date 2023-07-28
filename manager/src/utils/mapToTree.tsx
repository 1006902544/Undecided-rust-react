import { cloneDeep, sortBy } from 'lodash';

export interface MapToTreeOptions<T> {
  data: T[];
  fieldProps?: {
    children?: string;
    key?: string;
    pkey?: string;
  };
}

export type MapToTree<T = any> = (opt: MapToTreeOptions<T>) => any[];

export const mapToTree: MapToTree = (opt) => {
  const { data, fieldProps } = opt;
  let curData = cloneDeep(data);
  const container: any[] = [];
  const mapContainer: Record<string | number, any> = {};

  const key = fieldProps?.key ?? 'key';
  const pkey = fieldProps?.pkey ?? 'pkey';
  const children = fieldProps?.children ?? 'children';

  curData.forEach((r: any) => {
    mapContainer[r[key]] = r;
  });
  for (const curKey in mapContainer) {
    const route = mapContainer[curKey];
    if (route[pkey]) {
      const parent = mapContainer[route[pkey]];
      if (parent) {
        if (parent[children]) {
          parent[children].push(route);
        } else {
          parent[children] = [route];
        }
      }
    } else {
      container.push(route);
    }
  }
  return sortBy(container, 'sort');
};
