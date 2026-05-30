import type { IAuthor } from "@/types/interfaces/user/IAuthor";

/** DTO từ GET /users/friends/requests */
export interface IFriendRequest {
  requestId: number;       // ID của người gửi — dùng cho accept/decline
  sender: IAuthor;
  mutualFriendCount: number;
  createdAt: string;       // ISO 8601
}

/** Body cho POST /users/friends/requests */
export interface IFriendRequestCreate {
  userId: number;
  targetUserId: number;
}
