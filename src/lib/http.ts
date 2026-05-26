import { API, AUTH_TOKEN_NAME } from "@/common/constants";
import {
  RedirectLogin,
  RedirectLoginAndResetParam,
  RemoveToken,
} from "@/utils/redirectHelper";
import type { LoggedIn } from "@/types/interfaces/auth/LoggedIn";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

type CallbackQueue = Array<(token: string | null) => void>;

export class Http {
  private instance: AxiosInstance;
  private subscribers: CallbackQueue = [];
  private isRefresingToken: boolean = false;
  private baseUrl: string = "";

  constructor(baseURL: string) {
    this.baseUrl = baseURL;
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Set initial token if it exists
    const token = localStorage.getItem(AUTH_TOKEN_NAME);
    if (token) {
      this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    this.instance.interceptors.request.use(
      this.handleBeforeRequest.bind(this)
    );

    this.instance.interceptors.response.use(
      this.handleSuccess,
      this.handleRequestError.bind(this)
    );
  }

  private handleBeforeRequest(request: InternalAxiosRequestConfig) {
    const token = localStorage.getItem(AUTH_TOKEN_NAME);
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      delete request.headers.Authorization;
    }
    return request;
  }

  private handleSuccess(response: AxiosResponse) {
    return response;
  }

  private async handleRequestError(error: any) {
    // Network ERROR — no response at all
    if (error.code === "ERR_NETWORK" || !error.response) {
      return Promise.reject(error);
    }

    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401 && window.location.href.indexOf("/login") === -1) {
      // If refresing, keep in queue and not gonna call refresh token
      if (this.isRefresingToken === true) {
        return new Promise((resolve, reject) => {
          this.subscribers.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.instance(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      try {
        this.isRefresingToken = true;

        const response = await axios.post<ApiResultGeneric<LoggedIn>>(
          `${this.baseUrl}/${API.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const data = response.data;
        if (data.data != null) {
          const token = data.data?.token;
          localStorage.setItem(AUTH_TOKEN_NAME, token);
          this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;

          this.subscribers.forEach((callback) => callback(token));
          this.subscribers = [];

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.instance(originalRequest);
        }
      } catch (err) {
        this.subscribers.forEach((callback) => callback(null));
        this.subscribers = [];
        RemoveToken();
        RedirectLogin();
      } finally {
        this.isRefresingToken = false;
      }
    }

    // Not permission
    if (status === 403) {
      const currentPath = window.location.pathname;
      localStorage.setItem("PATH", currentPath);
      RemoveToken();
      RedirectLoginAndResetParam();
      return;
    }

    // const _data = error.response?.data as ApiResult;
    return Promise.reject(error);
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, { ...config, params });
    return response.data;
  }

  public async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async deleteWithBody<T>(url: string, data: any): Promise<T> {
    const response = await this.instance.delete<T>(url, { data });
    return response.data;
  }

  public async postWithFile<T>(url: string, data: any): Promise<T> {
    const response = await this.instance.post<T>(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }


  public async ExportFile<T>(url: string): Promise<T> {
    const response = await this.instance.get(url, { responseType: "blob" });
    return response.data;
  }

  public async ExportFileWithData<T>(url: string, data: any[]): Promise<T> {
    const response = await this.instance.request({
      method: "POST",
      url: url,
      data: data,
      responseType: "blob",
    });
    return response.data;
  }
}

export default new Http(import.meta.env.VITE_SERVER_API);
