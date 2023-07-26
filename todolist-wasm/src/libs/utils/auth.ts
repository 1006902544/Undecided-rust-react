import { useAuthStore } from "../store";

export const get_token = () => localStorage.getItem("token");

export const set_token = (token:string) => localStorage.setItem("token",token)

export const remove_token = () => localStorage.removeItem("token")