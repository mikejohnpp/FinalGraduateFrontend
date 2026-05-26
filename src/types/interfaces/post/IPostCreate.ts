export interface IPostCreate {
    userId: number;
    content: string;
    isGroupPosted?: boolean;
    groupId?: number | null;
}

export interface IPostUpdate {
    content: string;
}
