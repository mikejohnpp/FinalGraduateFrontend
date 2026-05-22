import type { GroupPost } from '@/types/GroupPost'

export const groupPosts: GroupPost[] = [
  {
    id: 'p1',
    groupId: 'g1',
    groupName: 'Hội Đường Dứa Miền Bắc',
    authorId: 'u1',
    authorName: 'Trần Văn A',
    authorRole: 'Quản trị viên',
    content: 'Chào buổi sáng cả nhà! Hôm nay thời tiết đẹp quá, mọi người đã tưới dứa chưa?',
    createdAt: '2 giờ trước',
    likeCount: 145,
    commentCount: 23,
    shareCount: 5,
    topComments: [
      {
        id: 'c1',
        authorId: 'u2',
        authorName: 'Lê Thị B',
        content: 'Chào sếp! Đã tưới xong từ 6h sáng rồi nhé =))',
        createdAt: '1 giờ trước',
        likeCount: 12
      }
    ]
  },
  {
    id: 'p2',
    groupId: 'g2',
    groupName: 'Cộng đồng ReactJS Việt Nam',
    authorId: 'u3',
    authorName: 'Nguyễn C',
    authorRole: 'Người đóng góp nổi bật',
    content: 'Có ai đang dùng React 19 chưa ạ? Cho mình xin ít review về useActionState với. Cảm ơn mọi người!',
    images: ['https://picsum.photos/seed/p2img/800/600'],
    createdAt: '4 giờ trước',
    likeCount: 342,
    commentCount: 89,
    shareCount: 12,
    topComments: [
      {
        id: 'c2',
        authorId: 'u4',
        authorName: 'Phạm D',
        content: 'Ngon lắm bạn ơi, giảm thiểu state management hẳn.',
        createdAt: '3 giờ trước',
        likeCount: 45
      },
      {
        id: 'c3',
        authorId: 'u5',
        authorName: 'Hoàng E',
        content: 'Đợi bản stable rồi xài, giờ vẫn còn nhiều bug.',
        createdAt: '2 giờ trước',
        likeCount: 23
      }
    ]
  },
  {
    id: 'p3',
    groupId: 'g3',
    groupName: 'Front-end Developers VN',
    authorId: 'u6',
    authorName: 'Vũ F',
    content: 'Mình vừa viết một bài hướng dẫn chi tiết về Tailwind CSS v4, mời mọi người tham khảo nhé!',
    linkPreview: {
      url: 'https://tailwindcss.com',
      title: 'Tailwind CSS v4 - Có gì mới?',
      description: 'Cùng tìm hiểu những tính năng mới nhất trong Tailwind CSS v4.',
      image: 'https://picsum.photos/seed/p3link/800/400'
    },
    createdAt: 'Hôm qua',
    likeCount: 567,
    commentCount: 45,
    shareCount: 120
  },
  {
    id: 'p4',
    groupId: 'g4',
    groupName: 'Hội những người đam mê phím cơ',
    authorId: 'u7',
    authorName: 'Đinh G',
    content: 'Mới tậu được em kit nhôm ngon quá anh em ạ. Gõ phê chữ ê kéo dài.',
    images: [
      'https://picsum.photos/seed/p4img1/800/800',
      'https://picsum.photos/seed/p4img2/800/800'
    ],
    createdAt: 'Hôm qua',
    likeCount: 890,
    commentCount: 134,
    shareCount: 34
  },
  {
    id: 'p5',
    groupId: 'g5',
    groupName: 'Chợ Mèo Cảnh Hà Nội',
    authorId: 'u8',
    authorName: 'Bùi H',
    content: 'Tìm chủ mới cho bé ALN màu silver này ạ. Bé được 2 tháng tuổi, ăn uống ngoan ngoãn, đi vệ sinh đúng chỗ.',
    images: ['https://picsum.photos/seed/p5img/600/800'],
    createdAt: '2 ngày trước',
    likeCount: 234,
    commentCount: 56,
    shareCount: 12
  },
  {
    id: 'p6',
    groupId: 'g6',
    groupName: 'Hội Review Đồ Ăn',
    authorId: 'u9',
    authorName: 'Ngô I',
    content: 'Quán bún ốc này ngon thật sự mọi người ơi. Nước dùng thanh ngọt, ốc to giòn, lại còn có thêm chuối đậu nữa. Mình cho 9/10 nhé.',
    images: [
      'https://picsum.photos/seed/p6img1/800/800',
      'https://picsum.photos/seed/p6img2/800/800',
      'https://picsum.photos/seed/p6img3/800/800'
    ],
    createdAt: '3 ngày trước',
    likeCount: 1200,
    commentCount: 345,
    shareCount: 89
  }
]
