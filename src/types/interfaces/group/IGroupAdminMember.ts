export interface IGroupAdminMember {
  id: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  requestedAt: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  joinedPlatformAt?: string;
}
