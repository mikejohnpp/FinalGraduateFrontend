export interface IGroupAdmin {
  id: number;
  name: string;
  avatarUrl?: string;
  coverUrl?: string;
  privacy: 'PUBLIC' | 'PRIVATE';
  memberCount: number;
  description?: string;
  createdAt: string;
  role: 'ADMIN' | 'MEMBER';
}
