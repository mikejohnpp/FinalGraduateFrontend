import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import { API } from "@/common/constants";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import type { CursorPageResponse, PageResponse } from "@/types/interfaces/post/IPostPage";

export interface UserAdminDTO {
  id: number;
  userName: string;
  email: string;
  nickName: string | null;
  phoneNumber: number | null;
  gender: string | null;
  dateOfBirth: string | null;
  isActive: boolean;
  roleName: string;
}

export interface GroupAdminDTO {
  id: number;
  name: string;
  privacy: string;
  isActive: boolean;
  adminId: number;
  adminName: string;
}

class AdminService extends BaseService {
  async getUsers(page: number = 0, size: number = 10, search: string = "") {
    return await http.get<ApiResultGeneric<PageResponse<UserAdminDTO>>>(API.ADMIN.USERS, {
      page,
      size,
      search,
    });
  }

  async createUser(data: any) {
    return await http.post<ApiResultGeneric<UserAdminDTO>>(API.ADMIN.USERS, data);
  }

  async updateUser(id: number, data: any) {
    return await http.put<ApiResultGeneric<UserAdminDTO>>(`${API.ADMIN.USERS}/${id}`, data);
  }

  async deleteUser(id: number) {
    return await http.delete<ApiResultGeneric<void>>(`${API.ADMIN.USERS}/${id}`);
  }

  async getGroups(page: number = 0, size: number = 10, search: string = "") {
    return await http.get<ApiResultGeneric<PageResponse<GroupAdminDTO>>>(API.ADMIN.GROUPS, {
      page,
      size,
      search,
    });
  }

  async createGroup(data: { name: string; privacy: string; adminId: number }) {
    return await http.post<ApiResultGeneric<any>>(API.ADMIN.GROUPS, data);
  }

  async updateGroup(id: number, data: any) {
    return await http.put<ApiResultGeneric<GroupAdminDTO>>(`${API.ADMIN.GROUPS}/${id}`, data);
  }

  async deleteGroup(id: number) {
    return await http.delete<ApiResultGeneric<void>>(`${API.ADMIN.GROUPS}/${id}`);
  }
}

export default new AdminService();
