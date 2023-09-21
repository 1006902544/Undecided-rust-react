import { useContext, useMemo } from 'react';
import { ResourceContext } from '..';

export const useResourceContext = () => {
  const resource = useContext(ResourceContext);
  return useMemo(() => resource, [resource]);
};
