import type { IAuthor } from "@/types/interfaces/user/IAuthor";
import type { MediaItem } from "@/types/interfaces/media/IMedia";

export interface IComment {
  id: number;
  author: IAuthor;
  postId: number;
  parentId: number | null; // null = comment gốc, có ID = reply
  content: string;
  media: MediaItem[];
  likeCount: number;
  replyCount: number; // Chỉ > 0 nếu là comment gốc
  liked: boolean; // User hiện tại đã like chưa
  createdAt: string;
  sentiment: string | null;
  confidence: number | null;
  cancelReason: string | null;
}
