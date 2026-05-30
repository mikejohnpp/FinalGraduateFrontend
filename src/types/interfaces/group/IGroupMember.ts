export interface IGroupMember {
  userId: number;
  name: string;
  avatar: string | null;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
}
