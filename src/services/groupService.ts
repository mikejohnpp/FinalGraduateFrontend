import BaseService from "@/types/base/BaseService";
import { API } from "@/common/constants";
import http from "@/lib/http";
import type { IGroup } from "@/types/interfaces/group/IGroup";
import type { IGroupMember } from "@/types/interfaces/group/IGroupMember";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";
import type { IPost } from "@/types/interfaces/post/IPost";
import type { ApiResultGeneric, ApiResult } from "@/types/interfaces/result/apiResult";

class GroupService extends BaseService {
  // Lấy chi tiết nhóm (có userId để check joined/role)
  async getGroupDetail(groupId: number, userId: number): Promise<IGroup | null> {
    try {
      const response = await http.get<ApiResultGeneric<IGroup>>(`${API.GROUP.BASE}/${groupId}`, {
        params: { userId },
      });
      return response.data ?? null;
    } catch (error) {
      console.error("Error fetching group detail", error);
      throw error;
    }
  }

  // Lấy danh sách nhóm đã tham gia
  async getJoinedGroups(userId: number): Promise<IGroup[]> {
    try {
      const response = await http.get<ApiResultGeneric<IGroup[]>>(API.GROUP.JOINED, {
        params: { userId },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching joined groups", error);
      throw error;
    }
  }

  // Lấy danh sách nhóm gợi ý
  async getSuggestedGroups(userId: number): Promise<IGroup[]> {
    try {
      const response = await http.get<ApiResultGeneric<IGroup[]>>(API.GROUP.SUGGESTED, {
        params: { userId },
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching suggested groups", error);
      throw error;
    }
  }

  // Tham gia nhóm
  async joinGroup(groupId: number, userId: number): Promise<boolean> {
    try {
      const response = await http.post<ApiResult>(`${API.GROUP.BASE}/${groupId}/join`, null, {
        params: { userId },
      });
      return response.success ?? false;
    } catch (error) {
      console.error("Error joining group", error);
      throw error;
    }
  }

  // Rời nhóm
  async leaveGroup(groupId: number, userId: number): Promise<boolean> {
    try {
      const response = await http.post<ApiResult>(`${API.GROUP.BASE}/${groupId}/leave`, null, {
        params: { userId },
      });
      return response.success ?? false;
    } catch (error) {
      console.error("Error leaving group", error);
      throw error;
    }
  }

  // Lấy thành viên nhóm
  async getGroupMembers(groupId: number): Promise<IGroupMember[]> {
    try {
      const response = await http.get<ApiResultGeneric<IGroupMember[]>>(
        `${API.GROUP.BASE}/${groupId}/members`,
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching group members", error);
      throw error;
    }
  }

  // Lấy feed của toàn bộ nhóm (Infinite Scroll)
  async getGroupFeed(
    userId: number,
    cursor?: string,
    size = 10,
  ): Promise<CursorPageResponse<IPost> | null> {
    try {
      const response = await http.get<ApiResultGeneric<CursorPageResponse<IPost>>>(API.GROUP.FEED, {
        params: { userId, cursor, size },
      });
      return response.data ?? null;
    } catch (error) {
      console.error("Error fetching group feed", error);
      throw error;
    }
  }

  // Lấy feed của một nhóm cụ thể
  async getSingleGroupPosts(
    groupId: number,
    userId: number,
    cursor?: string,
    size = 10,
  ): Promise<CursorPageResponse<IPost> | null> {
    try {
      const response = await http.get<ApiResultGeneric<CursorPageResponse<IPost>>>(
        `${API.GROUP.BASE}/${groupId}/posts`,
        {
          params: { userId, cursor, size },
        },
      );
      return response.data ?? null;
    } catch (error) {
      console.error("Error fetching single group posts", error);
      throw error;
    }
  }

  // Tạo nhóm mới
  async createGroup(
    userId: number,
    data: { name: string; privacy: "public" | "private"; invitees?: number[] },
  ): Promise<IGroup | null> {
    try {
      const response = await http.post<ApiResultGeneric<IGroup>>(API.GROUP.BASE, data, {
        params: { userId },
      });
      return response.data ?? null;
    } catch (error) {
      console.error("Error creating group", error);
      throw error;
    }
  }

  // Cập nhật ảnh đại diện nhóm (chỉ ADMIN) — BE chỉ lưu link
  async updateGroupAvatar(groupId: number, userId: number, avatar: string): Promise<IGroup | null> {
    try {
      const response = await http.put<ApiResultGeneric<IGroup>>(
        `${API.GROUP.BASE}/${groupId}/avatar`,
        { avatar },
        { params: { userId } },
      );
      return response.data ?? null;
    } catch (error) {
      console.error("Error updating group avatar", error);
      throw error;
    }
  }

  // Cập nhật ảnh bìa nhóm (chỉ ADMIN) — BE chỉ lưu link
  async updateGroupCover(
    groupId: number,
    userId: number,
    coverPhoto: string,
  ): Promise<IGroup | null> {
    try {
      const response = await http.put<ApiResultGeneric<IGroup>>(
        `${API.GROUP.BASE}/${groupId}/cover`,
        { coverPhoto },
        { params: { userId } },
      );
      return response.data ?? null;
    } catch (error) {
      console.error("Error updating group cover", error);
      throw error;
    }
  }
}


export default new GroupService();
