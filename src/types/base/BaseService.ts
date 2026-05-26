import http from "@/lib/http";
import type { ApiResult, ApiResultGeneric } from "../interfaces/result/apiResult";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

class BaseService {
  async getList<T>(url: string, id?: string | number, params?: QueryParams): Promise<Array<T>> {
    const finalUrl = id !== undefined ? `${url}/${id}` : url;
    const response = await http.get<ApiResultGeneric<Array<T>>>(finalUrl, params);
    return response.data ?? [];
  }

  async getSingle<T>(url: string, id?: string | number, params?: QueryParams): Promise<T | null> {
    const finalUrl = id !== undefined ? `${url}/${id}` : url;
    const response = await http.get<ApiResultGeneric<T>>(finalUrl, params);
    return response.data ?? null;
  }

  async create<T, TData = any>(url: string, data: TData): Promise<boolean> {
    const response = await http.post<ApiResultGeneric<T>>(url, data);
    return response.data != null;
  }

  async createAndGetData<T, TData = any>(url: string, data: TData): Promise<T | null> {
    const response = await http.post<ApiResultGeneric<T>>(url, data);
    return response.data ?? null;
  }

  async update<T, TData = any>(url: string, data: TData): Promise<boolean> {
    const response = await http.put<ApiResultGeneric<T>>(url, data);
    return response.data != null;
  }

  async updateAndGetData<T, TData = any>(url: string, data: TData): Promise<T | null> {
    const response = await http.put<ApiResultGeneric<T>>(url, data);
    return response.data ?? null;
  }

  async delete(
    url: string,
    id: Array<string> | Array<number>
  ): Promise<boolean> {
    const response = await http.delete<ApiResult>(
      `${url}/${id.join(",")}`
    );
    return response.code === 200;
  }

  async deleteWithBody<T>(url: string, data: T): Promise<boolean> {
    const response = await http.deleteWithBody<ApiResult>(url, data);
    return response.success ?? (response.code === 200 || response.code === 204);
  }

}

export default BaseService;
