export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isMuted?: boolean;
  isGroup?: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: "text" | "image" | "file" | "call";
  reactions?: Reaction[];
}

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export type TabFilter = "all" | "unread" | "groups";
