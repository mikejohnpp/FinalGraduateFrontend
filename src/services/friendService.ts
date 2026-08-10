import { API } from "@/common/constants";
import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import type { ApiResult, ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import type { IFriendStatusResponse } from "@/types/interfaces/friend/IFriendStatus";

export class FriendService extends BaseService {
  /** GET /users/friends?userId={userId}&cursor={cursor}&size={size} */
  async getFriends(userId: number, cursor?: string, size: number = 50): Promise<ApiResultGeneric<any> | undefined> {
    try {
      const query = new URLSearchParams({ userId: userId.toString(), size: size.toString() });
      if (cursor) query.append("cursor", cursor);
      return await http.get<ApiResultGeneric<any>>(`users/friends?${query.toString()}`);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /** PUT /users/friends/requests/{requestId}/accept?userId={userId} */
  async acceptRequest(requestId: number, userId: number): Promise<boolean> {
    const response = await http.put<ApiResult>(
      `users/friends/requests/${requestId}/accept?userId=${userId}`,
      null,
    );
    return response.success ?? (response.code === 200 || response.code === 201);
  }

  /** PUT /users/friends/requests/{requestId}/decline?userId={userId} */
  async declineRequest(requestId: number, userId: number): Promise<boolean> {
    const response = await http.put<ApiResult>(
      `users/friends/requests/${requestId}/decline?userId=${userId}`,
      null,
    );
    return response.success ?? response.code === 200;
  }

  /** GET /users/friends/status?userId={currentUserId}&targetId={targetUserId} */
  async getFriendStatus(currentUserId: number, targetUserId: number): Promise<IFriendStatusResponse | null> {
    try {
      const res = await http.get<ApiResultGeneric<IFriendStatusResponse>>(
        `users/friends/status?userId=${currentUserId}&targetId=${targetUserId}`,
      );
      return res.data ?? null;
    } catch {
      return null;
    }
  }

  /** POST /users/friends/requests — gửi lời mời kết bạn */
  async sendRequest(userId: number, targetUserId: number): Promise<boolean> {
    const response = await http.post<ApiResult>(`users/friends/requests`, { userId, targetUserId });
    return response.success ?? (response.code === 200 || response.code === 201);
  }

  /** DELETE /users/friends/requests/cancel?userId={userId}&targetId={targetUserId} */
  async cancelFriendRequest(userId: number, targetUserId: number): Promise<boolean> {
    const response = await http.delete<ApiResult>(
      `users/friends/requests/cancel?userId=${userId}&targetId=${targetUserId}`,
    );
    return response.success ?? response.code === 200;
  }

  /** DELETE /users/friends/{friendUserId}?userId={userId} */
  async unfriend(friendUserId: number, userId: number): Promise<boolean> {
    const response = await http.delete<ApiResult>(`users/friends/${friendUserId}?userId=${userId}`);
    return response.success ?? response.code === 200;
  }

  /** DELETE /users/friends/suggestions/{targetUserId}?userId={userId} */
  async dismissSuggestion(targetUserId: number, userId: number): Promise<boolean> {
    const response = await http.delete<ApiResult>(
      `${API.FRIEND.SUGGESTIONS}/${targetUserId}?userId=${userId}`,
    );
    return response.success ?? response.code === 200;
  }
}

export default new FriendService();
