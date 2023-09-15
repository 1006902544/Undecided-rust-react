import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ManagerInfo } from '../api/schema';
import { getManagerInfoByToken } from '../api';

interface AuthStore {
  auth?: ManagerInfo | null;
  set_auth: (auth: ManagerInfo) => void;
  clear_auth: () => void;
  getAuth: () => Promise<any>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        auth: null,

        set_auth: (auth) =>
          set(() => ({
            auth,
          })),

        clear_auth: () =>
          set(() => ({
            auth: null,
          })),

        getAuth: async () => {
          const res = await getManagerInfoByToken();
          return set(() => ({ auth: res.data }));
        },
      }),
      {
        name: 'auth_store',
      }
    )
  )
);
