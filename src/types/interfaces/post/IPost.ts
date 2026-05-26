import type { IBase } from "@/types/base/IBase";
import type { IAuthor } from "@/types/interfaces/user/IAuthor";

export interface IPost extends IBase {
    author: IAuthor;
    isGroupPosted: boolean;
    createdAt: string;
    commentCount: number;
    content: string;
    likeCount: number;
}
