import {create} from 'zustand'
import type { AdminInfo } from '../api/admin/schema'

export type SetAuth = (auth?:AdminInfo) => void

export type AuthState = {
  authInfo?:AdminInfo,
  setAuth:SetAuth
}

export const useAuthStore = create<AuthState>((set) => ({
  authInfo:undefined,

  setAuth:(authInfo?:AdminInfo) => set(() => ({
    authInfo
  }))
}))