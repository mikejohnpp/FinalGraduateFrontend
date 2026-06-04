import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import type { ApiResult, ApiResultGeneric } from "@/types/interfaces/result/apiResult";

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

  /** DELETE /users/friends/{friendUserId}?userId={userId} */
  async unfriend(friendUserId: number, userId: number): Promise<boolean> {
    const response = await http.delete<ApiResult>(`users/friends/${friendUserId}?userId=${userId}`);
    return response.success ?? response.code === 200;
  }
}

export default new FriendService();
