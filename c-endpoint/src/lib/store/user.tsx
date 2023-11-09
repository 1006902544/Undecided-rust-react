import { create } from 'zustand';
import { getApiUserSelf, postApiUserSignIn } from '../endpoint';
import type { UserSignInReq, UserUserInfo } from '../endpoint/schema';
import { getToken, removeToken } from '../utils/token';

interface UserStore {
  user: undefined | UserUserInfo;
  token?: undefined | string | null;

  signIn: (data: UserSignInReq) => void;
  initToken: () => void;

  getUserInfo: () => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  token: undefined,

  async signIn(data: UserSignInReq) {
    const res = await postApiUserSignIn(data);
    if (res.code === 200) {
      set({
        token: res.data,
      });
    }
  },

  initToken() {
    const token = getToken();
    set({ token });
  },

  async getUserInfo() {
    const res = await getApiUserSelf();
    if (res.code === 200) {
      set({ user: res.data });
    } else {
      this.clearAuth();
    }
  },

  clearAuth() {
    removeToken();
    set({
      user: undefined,
      token: undefined,
    });
  },
}));
