import type { IGroupAdminMember } from '@/types/interfaces/group/IGroupAdminMember';

export const mockMemberRequests: IGroupAdminMember[] = [
  {
    id: 1,
    userId: 101,
    username: 'Nguyễn Văn An',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    requestedAt: '2025-06-13T10:30:00.000Z',
    gender: 'MALE',
    joinedPlatformAt: '2019-03-22T00:00:00.000Z',
  },
  {
    id: 2,
    userId: 102,
    username: 'Trần Thị Bích',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    requestedAt: '2025-06-14T08:15:00.000Z',
    gender: 'FEMALE',
    joinedPlatformAt: '2021-07-10T00:00:00.000Z',
  },
  {
    id: 3,
    userId: 103,
    username: 'Lê Hoàng Dũng',
    avatarUrl: undefined,        // fallback to initials avatar
    requestedAt: '2025-06-14T14:00:00.000Z',
    gender: 'MALE',
    joinedPlatformAt: '2017-11-05T00:00:00.000Z',
  },
  {
    id: 4,
    userId: 104,
    username: 'Phạm Minh Châu',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    requestedAt: '2025-06-15T07:45:00.000Z',
    gender: 'FEMALE',
    joinedPlatformAt: '2022-01-18T00:00:00.000Z',
  },
];
