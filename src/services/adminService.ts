import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import { API } from "@/common/constants";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import type { PageResponse } from "@/types/interfaces/post/IPostPage";
import type {
  SentimentFilter,
  SentimentItemDTO,
  SentimentItemType,
  SentimentOverviewDTO,
} from "@/types/interfaces/admin/ISentiment";
import type { ReportOverviewDTO } from "@/types/interfaces/admin/IReport";

/** Loại bỏ các filter rỗng/undefined trước khi gửi lên server. */
function cleanFilter(filter: SentimentFilter): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });
  return params;
}


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

  async createUser(data: Record<string, unknown>) {
    return await http.post<ApiResultGeneric<UserAdminDTO>>(API.ADMIN.USERS, data);
  }

  async updateUser(id: number, data: Record<string, unknown>) {
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
    return await http.post<ApiResultGeneric<GroupAdminDTO>>(API.ADMIN.GROUPS, data);
  }

  async updateGroup(id: number, data: Record<string, unknown>) {
    return await http.put<ApiResultGeneric<GroupAdminDTO>>(`${API.ADMIN.GROUPS}/${id}`, data);
  }

  async deleteGroup(id: number) {
    return await http.delete<ApiResultGeneric<void>>(`${API.ADMIN.GROUPS}/${id}`);
  }

  // ===== Sentiment statistics =====
  async getSentimentOverview(filter: SentimentFilter = {}) {
    return await http.get<ApiResultGeneric<SentimentOverviewDTO>>(
      API.ADMIN.SENTIMENT_OVERVIEW,
      cleanFilter(filter),
    );
  }

  async getSentimentItems(
    filter: SentimentFilter = {},
    type: SentimentItemType = "post",
    page: number = 0,
    size: number = 20,
  ) {
    return await http.get<ApiResultGeneric<PageResponse<SentimentItemDTO>>>(
      API.ADMIN.SENTIMENT_ITEMS,
      { ...cleanFilter(filter), type, page, size },
    );
  }

  // ===== System report =====
  async getReportOverview() {
    return await http.get<ApiResultGeneric<ReportOverviewDTO>>(API.ADMIN.REPORT_OVERVIEW);
  }

  /** Trả về Blob CSV (responseType blob, không parse JSON). */
  async exportReport() {
    return await http.ExportFile<Blob>(API.ADMIN.REPORT_EXPORT);
  }
}

export default new AdminService();
