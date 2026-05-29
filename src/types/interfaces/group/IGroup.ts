export interface IGroup {
  id: number;
  name: string;
  coverPhoto: string | null;
  avatar: string | null;
  privacy: "public" | "private";
  memberCount: number;
  isJoined: boolean;
  role: "ADMIN" | "MODERATOR" | "MEMBER" | null;
  mutualFriendCount: number;
}
