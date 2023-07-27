import { ListContext, ListContextProps } from '../';
import { useContext, useMemo } from 'react';

export function useListContext<Req = any, Res = any>():
  | ListContextProps<Req, Res>
  | undefined {
  const context = useContext(ListContext);

  return useMemo(() => context, [context]);
}
