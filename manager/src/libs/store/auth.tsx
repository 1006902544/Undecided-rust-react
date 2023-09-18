import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ManagerInfo } from '../api/schema';
import { getManagerInfoByToken } from '../api';
import { setToken } from '@/utils';

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
          setToken(res.data.token);
          return set(() => ({ auth: res.data.info }));
        },
      }),
      {
        name: 'auth_store',
      }
    )
  )
);
