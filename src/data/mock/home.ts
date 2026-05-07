import type { Story, Post, Contact, Shortcut, CurrentUser } from "@/types/HomeFeed"

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
