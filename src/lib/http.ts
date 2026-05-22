import { API, AUTH_TOKEN_NAME, AUTH_TOKEN_REMEMBER } from "@/common/constants";
import {
  RedirectLogin,
  RedirectLoginAndResetParam,
  RemoveToken,
} from "@/utils/redirectHelper";
// import i18n from "@/plugins/i18n";
// import { useErrorStore } from "@/stores/error";
// import { useSettingStore } from "@/stores/setting";
import type { LoggedIn } from "@/types/interfaces/auth/LoggedIn";
import type { ApiResult, ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import axios, {
  type AxiosInstance,
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
        Authorization: `Bearer ${localStorage.getItem(
          AUTH_TOKEN_NAME
        )}`,
      },
    });
    this.instance.interceptors.request.use(
      this.handleBeforeRequest.bind(this)
    );

    this.instance.interceptors.response.use(
      this.handleSuccess,
      this.handleRequestError.bind(this)
    );
  }

  private handleBeforeRequest(request: InternalAxiosRequestConfig) {
    // const errorStore = useErrorStore();
    // errorStore.clear();
    //
    request.headers.Authorization = `Bearer ${localStorage.getItem(
      AUTH_TOKEN_NAME
    )}`;

    return request;
  }

  private handleSuccess(response: AxiosResponse) {
    return response;
  }

  private async handleRequestError(error: any) {
    //Network ERROR
    if (error.code === "ERR_NETWORK") {
      // toast.error("Lỗi mạng. Vui lòng thử lại!", {
      //   autoClose: false,
      //   closeButton: true,
      //   closeOnClick: true,
      // });
      return;
    }
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 401 && window.location.href.indexOf("/login") == -1) {
      // const is_remember = localStorage.getItem(AUTH_TOKEN_REMEMBER);
      // if (is_remember != null && is_remember == "true") {
      if (this.isRefresingToken === false) {
        try {
          this.isRefresingToken = true;
          axios
            .post<ApiResultGeneric<LoggedIn>>(
              this.baseUrl + API.REFRESH,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
              { withCredentials: true },
            )
            .then((response) => {
              const data = response.data;
              if (data.code == 200 && data.data != null) {
                const token = data.data?.access_token;
                localStorage.setItem(AUTH_TOKEN_NAME, token);
                this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
                this.subscribers.forEach((callback) =>
                  callback(token)
                );
              }
            })
            .catch((err) => {
              console.log(err);
              RemoveToken();
              RedirectLogin();
            });
        } catch (err) {
          // this.subscribers.forEach((callback) => callback(null));
          this.subscribers = [];
          window.location.href = "/login";
        } finally {
          this.subscribers = [];
          this.isRefresingToken = false;
        }
      }
      // Trả về một hàm callback để gọi lại API đã bị lỗi 401 trước đó
      return new Promise((resolve, reject) => {
        this.subscribers.push((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest)); // Gọi lại API đã bị lỗi 401
          } else {
            reject(error);
          }
        });
      });
      // } else {
      //   // toast.error(i18n.global.t("token_expired"), {
      //   //   autoClose: false,
      //   //   closeButton: true,
      //   //   closeOnClick: true,
      //   // });
      //   RemoveToken();
      //   RedirectLogin();
      // }
    }

    //not permission
    if (status === 403) {
      localStorage.setItem("isToastNotPermission", "true");
      const currentPath = window.location.pathname;
      localStorage.setItem("PATH", currentPath);
      // toast.error(i18n.global.t("permission_denied"), {
      //   autoClose: false,
      //   closeButton: true,
      //   closeOnClick: true,
      // });

      // useSettingStore().permission = false;
      RemoveToken();
      RedirectLoginAndResetParam();
      return;
    }
    const data = error.response?.data as ApiResult;
    // const errorStore = useErrorStore();
    // errorStore.setError(true, [data.message ?? "An error occured"]);
    return Promise.reject(error);
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    this.instance.defaults.headers["Content-Type"] = "application/json";
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data: any): Promise<T> {
    this.instance.defaults.headers["Content-Type"] = "application/json";
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  public async postWithFile<T>(url: string, data: any): Promise<T> {
    this.instance.defaults.headers["Content-Type"] = "multipart/form-data";
    const response = await this.instance.post<T>(url, data);
    this.instance.defaults.headers["Content-Type"] = "application/jsons";
    return response.data;
  }

  public async put<T>(url: string, data: any): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
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
