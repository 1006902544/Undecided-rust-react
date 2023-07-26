import { Resource } from './types.d';
import { createContext } from 'react';

export const ResourceContext = createContext<Array<Resource>>([]);

export const QueryResourceProvider = ({
  children,
  resources,
}: {
  children: React.ReactNode;
  resources: Array<Resource>;
}) => {
  return (
    <ResourceContext.Provider value={resources}>
      {children}
    </ResourceContext.Provider>
  );
};
