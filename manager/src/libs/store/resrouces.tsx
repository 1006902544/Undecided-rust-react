import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Resource } from '@/components/queryList';

export interface ResourceStore {
  resources: Array<Resource>;
  setResources: (resources: Array<Resource>) => void;
}

export const useResourceStore = create<ResourceStore>()(
  devtools(
    persist(
      (set) => ({
        resources: [],
        setResources: (resources) => () => set({ resources }),
      }),
      {
        name: 'resources_store',
      }
    )
  )
);
