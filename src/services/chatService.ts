import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import type { Conversation } from "@/components/messenger/interface/Conversation";

export class ChatService extends BaseService {
  async createDirectConversation(userOppenentId: number, userCurrentId: number): Promise<ApiResultGeneric<Conversation> | undefined> {
    try {
      return await http.post<ApiResultGeneric<Conversation>>(`chat/conversations`, { userOppenentId, userCurrentId });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createGroupConversation(name: string, memberIds: number[], userCurrentId: number): Promise<ApiResultGeneric<Conversation> | undefined> {
    try {
      const data = { name, memberIds, userCurrentId };
      return await http.post<ApiResultGeneric<Conversation>>(`chat/conversations/create_group`, data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async addMembersToGroup(conversationId: number, memberIds: number[], userCurrentId: number): Promise<ApiResultGeneric<Conversation> | undefined> {
    try {
      const data = { memberIds, userCurrentId };
      return await http.post<ApiResultGeneric<Conversation>>(`chat/conversations/${conversationId}/members`, data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getConversationDetail(conversationId: number, page: number = 0, size: number = 50): Promise<ApiResultGeneric<any> | undefined> {
    try {
      return await http.get<ApiResultGeneric<any>>(`chat/conversations/conversation/${conversationId}?page=${page}&size=${size}`);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default new ChatService();
