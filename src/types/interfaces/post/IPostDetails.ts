import type { IBase } from "@/types/base/IBase";

export interface IPostDetails extends IBase {
    authorName: string;
    isGroupPosted: boolean;
    createdAt: string;
    content: string;
    likeCount: number;
}
