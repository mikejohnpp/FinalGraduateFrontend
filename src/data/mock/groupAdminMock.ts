import type { IGroupAdmin } from '@/types/interfaces/group/IGroupAdmin';
import type { IGroupStats } from '@/types/interfaces/group/IGroupStats';

export const mockGroup: IGroupAdmin = {
  id: 1,
  name: 'Nhóm test',
  avatarUrl: 'https://i.pravatar.cc/150?img=10',
  coverUrl: 'https://picsum.photos/seed/group1/1200/400',
  privacy: 'PRIVATE',
  memberCount: 1,
  description: 'Đây là nhóm thử nghiệm tính năng quản lý nhóm.',
  createdAt: '2024-01-15T08:00:00.000Z',
  role: 'ADMIN',
};

export const mockGroupStats: IGroupStats = {
  pendingReviews: 0,
  reportedContent: 0,
  pendingPosts: 3,
  memberRequests: 2,
  groupStatusViolations: 0,
  moderationNotifications: 0,
  weeklyPosts: 8,
  weeklyPostsChange: 12.5,
  weeklyComments: 24,
  weeklyCommentsChange: -5.3,
  weeklyReactions: 47,
  weeklyReactionsChange: 0,
  activeMembers: 1,
  activeMembersChange: 0,
  weeklyActivity: [
    { label: 'Th 8/5', value: 0 },
    { label: 'Th 9/5', value: 1 },
    { label: 'Th 10/5', value: 0 },
    { label: 'Th 11/5', value: 2 },
    { label: 'Th 12/5', value: 1 },
    { label: 'Th 13/5', value: 0 },
    { label: 'Th 14/6', value: 1 },
  ],
};
