import type { IAuthor } from "@/types/interfaces/user/IAuthor";

/** DTO từ GET /users/friends */
export interface IFriendship {
  user: IAuthor;
  friendSince: string;     // ISO 8601
  mutualFriendCount: number;
}
