export interface Conversation {
  id: number;
  name: string;
  group: boolean;
  createdAt: string;
  active: boolean;
  members: UserResponse[];
}

export interface UserResponse {
  id: number;
  username: string;
  avatarUrl: string;
}
