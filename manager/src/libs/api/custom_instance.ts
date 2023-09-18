import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '@/utils';
import { message } from 'antd';

const baseURL = process.env.REACT_APP_BASE_API_URL;

export const AXIOS_INSTANCE = Axios.create({ baseURL});

AXIOS_INSTANCE.interceptors.response.use(
  req=> req,
  err=>{
  if(err.response.data.status ===401  ) {
    removeToken();
    window.location.hash="/signIn"
  }
    message.error(err?.response?.data?.message||err.message)
    return Promise.reject(err)
});

export const custom_instance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const token = getToken()

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
    headers:{
      Authorization:token,
    }
  }).then((res) => {
    return res.data??{}
  });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;