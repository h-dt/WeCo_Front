import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { getCookie } from 'utils/common';
import * as LocalStorage from '../stores/LocalStore';
import * as SessionStorage from '../stores/SessionStore';
const instance = axios.create({
  baseURL: 'http://hlcc.shop:8000/',
  //baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'X-Auth-Token': getCookie('accessToken'),
  },
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response;
    } else {
      if (response.status === 401) {
        // common error
      }
      return Promise.reject(response.data);
    }
  },
  async (error: any) => {
    return Promise.reject(error);
  }
);

// header에 token 셋팅
export const setAuthToken = (token: string) => {
  instance.defaults.headers.common['X-Auth-Token'] = token;
  // LocalStorage.setAuthToken(token);
  // SessionStorage.setAuthToken(token);
};

export const ajaxGet = async <T = any,>(
  subUrl: string,
  params?: any
): Promise<AxiosResponse<T>> => {
  return instance.get(subUrl, params);
};

export const ajaxPost = async <T = any,>(
  subUrl: string,
  params?: any
): Promise<AxiosResponse<T>> => {
  return instance.post(subUrl, params);
};

export const ajaxPut = async <T = any,>(
  subUrl: string,
  params: any
): Promise<AxiosResponse<T>> => {
  return instance.put(subUrl, params);
};

export const ajaxDelete = async <T = any,>(
  subUrl: string,
  params?: any
): Promise<AxiosResponse<T>> => {
  return instance.delete(subUrl, params);
};
