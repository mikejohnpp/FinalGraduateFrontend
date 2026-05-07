import type { Story, Post, Contact, Shortcut, CurrentUser, Comment } from "@/types/HomeFeed"

export const currentUser: CurrentUser = {
  name: "Nguyen Van A",
  avatarUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=300&h=300&q=80",
}

export const stories: Story[] = [
  { id: "story-0", name: "Tin của bạn", avatarUrl: currentUser.avatarUrl, imageUrl: "" },
  { id: "story-1", name: "Lam Phong", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80" },
  { id: "story-2", name: "Hai My", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80" },
  { id: "story-3", name: "Ngoc Vang", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80" },
  { id: "story-4", name: "Long Phan", avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&w=300&h=300&q=80" },
  { id: "story-5", name: "Thao Nguyen", avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=300&h=300&q=80" },
  { id: "story-6", name: "Minh Kiet", avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=300&h=300&q=80" },
]

export const mockComments: Record<string, Comment[]> = {
  "post-1": [
    {
      id: "c1-1",
      author: {
        name: "Hai My",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Chúc mừng bạn nè! 🎉",
      time: "1 giờ trước",
      likeCount: 5,
      replyCount: 2,
      replies: [
        {
          id: "c1-1-r1",
          author: {
            name: "Lam Phong",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Cảm ơn My nhiều nha ❤️",
          time: "55 phút trước",
          likeCount: 2,
        },
        {
          id: "c1-1-r2",
          author: {
            name: "Long Phan",
            avatarUrl:
              "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Xứng đáng! 💪",
          time: "40 phút trước",
          likeCount: 1,
        },
      ],
    },
    {
      id: "c1-2",
      author: {
        name: "Ngoc Vang",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Dự án gì vậy? Cho xem với",
      time: "45 phút trước",
      likeCount: 0,
    },
    {
      id: "c1-3",
      author: {
        name: "Long Phan",
        avatarUrl:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Tuyệt vời! 👍",
      time: "30 phút trước",
      likeCount: 3,
    },
  ],

  "post-2": [
    {
      id: "c2-1",
      author: {
        name: "Lam Phong",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Trời đẹp thật, đi đâu vậy? ☀️",
      time: "4 giờ trước",
      likeCount: 2,
      replyCount: 1,
      replies: [
        {
          id: "c2-1-r1",
          author: {
            name: "Hai My",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Ra biển Vũng Tàu nè 🏖️",
          time: "3 giờ trước",
          likeCount: 4,
        },
      ],
    },
    {
      id: "c2-2",
      author: {
        name: "Nguyen Van A",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Nhìn relax ghê 😍",
      time: "3 giờ trước",
      likeCount: 1,
    },
  ],

  "post-3": [
    {
      id: "c3-1",
      author: {
        name: "Ngoc Vang",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Đi mà không rủ tui 😢",
      time: "20 giờ trước",
      likeCount: 6,
      replyCount: 3,
      replies: [
        {
          id: "c3-1-r1",
          author: {
            name: "Nguyen Van A",
            avatarUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Tại bạn không online 😅",
          time: "19 giờ trước",
          likeCount: 2,
        },
        {
          id: "c3-1-r2",
          author: {
            name: "Hai My",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Lần sau rủ nha! 😄",
          time: "18 giờ trước",
          likeCount: 1,
        },
        {
          id: "c3-1-r3",
          author: {
            name: "Ngoc Vang",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Oke nha, hẹn lần sau! 🙌",
          time: "17 giờ trước",
          likeCount: 0,
        },
      ],
    },
    {
      id: "c3-2",
      author: {
        name: "Lam Phong",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Quán nào ngon không? Giới thiệu đi",
      time: "1 ngày trước",
      likeCount: 2,
    },
  ],

  "post-4": [
    {
      id: "c4-1",
      author: {
        name: "Hai My",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Cuốn này hay lắm! Mình đọc rồi, thực sự thay đổi mindset nhiều 🔥",
      time: "2 ngày trước",
      likeCount: 8,
      replyCount: 4,
      replies: [
        {
          id: "c4-1-r1",
          author: {
            name: "Ngoc Vang",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Bạn đọc bản tiếng Việt hay tiếng Anh?",
          time: "2 ngày trước",
          likeCount: 1,
        },
        {
          id: "c4-1-r2",
          author: {
            name: "Hai My",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Mình đọc bản tiếng Việt, dịch khá ổn nha",
          time: "2 ngày trước",
          likeCount: 2,
        },
        {
          id: "c4-1-r3",
          author: {
            name: "Lam Phong",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Bản tiếng Anh đọc sướng hơn nếu quen 😄",
          time: "2 ngày trước",
          likeCount: 3,
        },
        {
          id: "c4-1-r4",
          author: {
            name: "Nguyen Van A",
            avatarUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Mình sẽ thử bản gốc xem sao 📖",
          time: "1 ngày trước",
          likeCount: 0,
        },
      ],
    },
    {
      id: "c4-2",
      author: {
        name: "Lam Phong",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Cuốn tiếp theo nên đọc gì vậy? 🤔",
      time: "3 ngày trước",
      likeCount: 4,
      replyCount: 2,
      replies: [
        {
          id: "c4-2-r1",
          author: {
            name: "Ngoc Vang",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "Deep Work của Cal Newport, đỉnh lắm! 🙌",
          time: "3 ngày trước",
          likeCount: 5,
        },
        {
          id: "c4-2-r2",
          author: {
            name: "Hai My",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
          },
          content: "The Power of Now cũng không tệ nha",
          time: "2 ngày trước",
          likeCount: 2,
        },
      ],
    },
    {
      id: "c4-3",
      author: {
        name: "Nguyen Van A",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=300&h=300&q=80",
      },
      content: "Mình cũng đang đọc, hay thật! Chapter về habit stacking áp dụng được ngay",
      time: "3 ngày trước",
      likeCount: 7,
    },
  ],
}

// ─────────────────────────────────────────────────────────────
// Mock posts (với reactionCount, commentCount đầy đủ)
// ─────────────────────────────────────────────────────────────
export const posts: Post[] = [
  {
    id: "post-1",
    author: {
      name: "Lam Phong",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
    },
    content:
      "Vừa hoàn thành xong dự án cuối kì! Cảm ơn mọi người đã support ❤️",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    likes: 42,
    comments: 12,
    reactionCount: 42,
    commentCount: 12,
    commentList: mockComments["post-1"],
    time: "2 giờ trước",
  },
  {
    id: "post-2",
    author: {
      name: "Hai My",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
    },
    content: "Một ngày đẹp trời ☀️",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    likes: 28,
    comments: 5,
    reactionCount: 28,
    commentCount: 5,
    commentList: mockComments["post-2"],
    time: "5 giờ trước",
  },
  {
    id: "post-3",
    author: {
      name: "Nguyen Van A",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=300&h=300&q=80",
    },
    content: "Đi cà phê với bạn bè 🎉",
    likes: 15,
    comments: 3,
    reactionCount: 15,
    commentCount: 3,
    commentList: mockComments["post-3"],
    time: "1 ngày trước",
  },
  {
    id: "post-4",
    author: {
      name: "Ngoc Vang",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
    },
    content:
      "Mới đọc xong cuốn sách 'Atomic Habits'. Thực sự thay đổi cách nhìn về thói quen hàng ngày. Recommend cho ai muốn cải thiện bản thân! 📚",
    likes: 56,
    comments: 18,
    reactionCount: 56,
    commentCount: 18,
    commentList: mockComments["post-4"],
    time: "3 ngày trước",
  },
]

export const contacts: Contact[] = [
  { id: "c-1", name: "Lam Phong", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: true },
  { id: "c-2", name: "Hai My", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: true },
  { id: "c-3", name: "Ngoc Vang", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: false },
  { id: "c-4", name: "Long Phan", avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: true },
  { id: "c-5", name: "Thao Nguyen", avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: false },
  { id: "c-6", name: "Minh Kiet", avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: true },
  { id: "c-7", name: "Duc Huy", avatarUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: true },
  { id: "c-8", name: "Thanh Tran", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=300&h=300&q=80", isOnline: false },
]

export const shortcuts: Shortcut[] = [
  { id: "s-1", label: "Bạn bè", icon: "Users" },
  { id: "s-2", label: "Nhóm", icon: "UsersRound" },
  { id: "s-3", label: "Watch", icon: "Video" },
  { id: "s-4", label: "Đã lưu", icon: "Bookmark" },
  { id: "s-5", label: "Sự kiện", icon: "Calendar" },
  { id: "s-6", label: "Kỷ niệm", icon: "Clock" },
]
