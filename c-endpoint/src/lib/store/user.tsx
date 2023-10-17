import { create } from 'zustand';

export const useUserStore = create(() => ({
  user: undefined,
  loading: false,

  getUser: async () => {},
}));
