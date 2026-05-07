import type { Post } from '@/types/Post'

export const mockPosts: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_1',
    authorName: 'Hoàng Phúc Tạ',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    content: 'Hôm nay trời đẹp quá! 🌞',
    images: ['https://images.unsplash.com/photo-1506744626753-1fa44f4a311b?w=800&auto=format&fit=crop'],
    createdAt: '1 tháng 5 lúc 20:05',
    likeCount: 42,
    commentCount: 5,
    shareCount: 1,
    hashtags: ['#sunshine', '#goodday']
  },
  {
    id: 'post_2',
    authorId: 'user_1',
    authorName: 'Hoàng Phúc Tạ',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    content: 'Vừa hoàn thành xong project mới, chuẩn bị nghỉ ngơi thôi 🚀',
    createdAt: 'Hôm qua lúc 15:30',
    likeCount: 120,
    commentCount: 15,
    shareCount: 2
  },
  {
    id: 'post_3',
    authorId: 'user_1',
    authorName: 'Hoàng Phúc Tạ',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    content: 'Cà phê sáng tại Tiệm Cũ ☕️',
    images: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop'],
    createdAt: '25 tháng 4 lúc 08:00',
    likeCount: 85,
    commentCount: 8,
    shareCount: 0
  }
]
