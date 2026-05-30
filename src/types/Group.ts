export type GroupPrivacy = "public" | "private";

export interface Group {
  id: string;
  name: string;
  coverPhoto?: string;
  avatar?: string;
  privacy: GroupPrivacy;
  memberCount: number;
  postFrequency?: string; // "10 bài viết/ngày"
  lastAccessed?: string; // "7 phút trước"
  mutualFriends?: string[]; // Tên bạn bè chung
  mutualFriendCount?: number;
  isJoined: boolean;
  role?: "admin" | "moderator" | "member";
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: "admin" | "moderator" | "member";
}
