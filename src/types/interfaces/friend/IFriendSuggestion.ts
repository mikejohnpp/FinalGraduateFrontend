import type { IAuthor } from "@/types/interfaces/user/IAuthor";

/** DTO từ GET /users/friends/suggestions */
export interface IFriendSuggestion {
  user: IAuthor;
  mutualFriendCount: number;
}
