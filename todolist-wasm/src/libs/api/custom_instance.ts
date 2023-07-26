import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { get_token } from '@/libs/utils';
import { prompt } from '@/components';

const baseURL = process.env.BASE_URL;

export const AXIOS_INSTANCE = Axios.create({ baseURL});

AXIOS_INSTANCE.interceptors.response.use(
  req=> req,
  err=>{
    prompt({
      title:'found error',
      content:err.response?.data?.message??err.message??'found error'
    })
    return Promise.reject(err)
});

export const custom_instance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const token = get_token()

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
    headers:{
      Authorization:token,
      "content-type": 'application/x-www-form-urlencoded'
    }
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;