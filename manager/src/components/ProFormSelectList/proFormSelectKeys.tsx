import { getCompanyList, getTagsList, getTypesList } from '@/libs/api';
import type { ListRes } from '@/libs/api/schema';

export type Keys = 'tag' | 'type' | 'company';
type Fn = () => Promise<ListRes>;

export const proFormSelectKeys: Record<Keys, Fn> = {
  tag: getTypesList,
  type: getTagsList,
  company: getCompanyList,
};
