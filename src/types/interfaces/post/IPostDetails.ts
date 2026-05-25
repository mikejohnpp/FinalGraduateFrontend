import type { IBase } from "@/types/base/IBase";

export interface IPostDetails extends IBase {
    authorName: string,
    isGroupPosted: boolean,
    createdAt: string,
    contents: Array<string>
}
