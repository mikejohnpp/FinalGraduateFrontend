import type { IBase } from "@/types/base/IBase";

export interface IPost extends IBase {
    authorName: string;
    isGroupPosted: boolean;
    createdAt: string;
    commentCount: number;
    content: string;
    likeCount: number;
}
