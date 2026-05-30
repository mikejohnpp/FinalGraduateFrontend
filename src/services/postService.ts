import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import type { ApiResult } from "@/types/interfaces/result/apiResult";

export class PostService extends BaseService {
  async likePost(postId: number, userId: number): Promise<boolean> {
    const response = await http.post<ApiResult>(`users/posts/${postId}/like`, { userId });
    return response.success ?? (response.code === 200 || response.code === 201);
  }

  async unlikePost(postId: number, userId: number): Promise<boolean> {
    const response = await http.deleteWithBody<ApiResult>(`users/posts/${postId}/like`, { userId });
    return response.success ?? (response.code === 200 || response.code === 204);
  }
}

export default new PostService();
