export interface IGroupAdminPost {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string;             // ISO string
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
