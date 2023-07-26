import { ListContext, ListContextProps } from '../';
import { useContext } from 'react';

export function useListContext<Req = any, Res = any>():
  | ListContextProps<Req, Res>
  | undefined {
  const context = useContext(ListContext);
  return context;
}
