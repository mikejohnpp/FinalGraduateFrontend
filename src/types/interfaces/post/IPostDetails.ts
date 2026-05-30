import type { IBase } from "@/types/base/IBase";
import type { IAuthor } from "@/types/interfaces/user/IAuthor";

export interface IPostDetails extends IBase {
    author: IAuthor;
    isGroupPosted: boolean;
    createdAt: string;
    content: string;
    likeCount: number;
    hasLiked?: boolean;
}
