import type { IAuthor } from "@/types/interfaces/user/IAuthor";

export type NotificationType =
    | "COMMENT"
    | "REPLY"
    | "FRIEND_REQUEST"
    | "FRIEND_ACCEPT"
    | "GROUP_JOIN_REQUEST"
    | "GROUP_JOIN_APPROVED"
    | "GROUP_POST_PENDING"
    | "GROUP_POST_APPROVED";

export interface INotification {
    id: number;
    actor: IAuthor | null;
    type: NotificationType;
    entityType: string | null;
    entityId: number | null;
    message: string | null;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}
