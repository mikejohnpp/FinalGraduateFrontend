import type { IAuthor } from "@/types/interfaces/user/IAuthor";

export interface IComment {
  id: number;
  author: IAuthor;
  postId: number;
  parentId: number | null; // null = comment gốc, có ID = reply
  content: string;
  likeCount: number;
  replyCount: number; // Chỉ > 0 nếu là comment gốc
  liked: boolean; // User hiện tại đã like chưa
  createdAt: string;
}
