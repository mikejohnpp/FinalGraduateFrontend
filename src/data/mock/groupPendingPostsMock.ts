import type { IGroupAdminPost } from '@/types/interfaces/group/IGroupAdminPost';

export const mockPendingPosts: IGroupAdminPost[] = [
  {
    id: 201,
    authorId: 101,
    authorName: 'Nguyễn Văn An',
    authorAvatarUrl: 'https://i.pravatar.cc/150?img=11',
    content:
      'Chào cả nhóm! Mình vừa tìm được một bài viết rất hay về game localization, chia sẻ để mọi người cùng đọc nhé. Theo mình thì đây là vấn đề cực kỳ thú vị đặc biệt với các tựa game RPG có cốt truyện sâu.',
    createdAt: '2025-06-15T06:20:00.000Z',
    status: 'PENDING',
  },
  {
    id: 202,
    authorId: 102,
    authorName: 'Trần Thị Bích',
    authorAvatarUrl: 'https://i.pravatar.cc/150?img=47',
    content:
      'Hỏi mọi người một chút: có ai biết tool nào để quản lý bản dịch game hiệu quả không? Mình đang tìm cái gì đó có thể handle được context và glossary cùng lúc.',
    createdAt: '2025-06-15T09:05:00.000Z',
    status: 'PENDING',
  },
  {
    id: 203,
    authorId: 104,
    authorName: 'Phạm Minh Châu',
    authorAvatarUrl: 'https://i.pravatar.cc/150?img=23',
    content: 'Chia sẻ vài tấm ảnh từ sự kiện game jam cuối tuần vừa rồi!',
    createdAt: '2025-06-15T11:30:00.000Z',
    status: 'PENDING',
  },
];
