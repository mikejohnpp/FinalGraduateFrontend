import BaseService from "@/types/base/BaseService";
import { API } from "@/common/constants";
import type { IStoryDTO, IStoryRequest } from "@/types/interfaces/story/IStory";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import http from "@/lib/http";

export class StoryService extends BaseService {
  async createStory(payload: IStoryRequest): Promise<IStoryDTO | null> {
    const res = await http.post<ApiResultGeneric<IStoryDTO>>(API.STORY.BASE, payload);
    return res.data ?? null;
  }

  async getFriendsStories(userId: number): Promise<IStoryDTO[]> {
    const res = await http.get<ApiResultGeneric<IStoryDTO[]>>(API.STORY.FRIENDS, { userId });
    return res.data ?? [];
  }
}

export default new StoryService();
