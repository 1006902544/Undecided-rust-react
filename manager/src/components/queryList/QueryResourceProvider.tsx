import { Resource } from './types.d';
import { createContext, useMemo } from 'react';

export const ResourceContext = createContext<Record<string, Resource>>({});

export const QueryResourceProvider = ({
  children,
  resources,
}: {
  children: React.ReactNode;
  resources: Array<Resource>;
}) => {
  const resourceValue = useMemo(() => {
    let resourceValue: Record<string, Resource> = {};
    resources.forEach((resource) => {
      resourceValue[resource.name] = resource;
    });
    return resourceValue;
  }, [resources]);

  return (
    <ResourceContext.Provider value={resourceValue}>
      {children}
    </ResourceContext.Provider>
  );
};
