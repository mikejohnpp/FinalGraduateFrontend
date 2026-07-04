import type { IBase } from "@/types/base/IBase";
import type { IAuthor } from "@/types/interfaces/user/IAuthor";
import type { MediaItem } from "@/types/interfaces/media/IMedia";

export interface IPostDetails extends IBase {
  author: IAuthor;
  isGroupPosted: boolean;
  createdAt: string;
  content: string;
  likeCount: number;
  hasLiked?: boolean;
  media: MediaItem[];
  sentiment: string | null;
  confidence: number | null;
  cancelReason: string | null;
  status: string | null;
}

