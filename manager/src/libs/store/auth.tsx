import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AdminInfo } from '../api/schema';

interface AuthStore {
  auth?: AdminInfo | null;
  set_auth: (auth: AdminInfo) => void;
  clear_auth: () => void;
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
      }),
      {
        name: 'auth_store',
      }
    )
  )
);
