// Mock data — chỉ dùng tham khảo, các views không import trực tiếp
type FriendProfile = {
  id: string;
  name: string;
  avatarUrl: string;
  mutualCount?: number;
};

export const friendRequests: FriendProfile[] = [
  {
    id: "req-1",
    name: "Lam Phong Luckystar",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 4,
  },
  {
    id: "req-2",
    name: "Hai My",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 2,
  },
  {
    id: "req-3",
    name: "Ngoc Vang",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 5,
  },
  {
    id: "req-4",
    name: "Long Phan",
    avatarUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 1,
  },
];

export const friendSuggestions: FriendProfile[] = [
  {
    id: "sug-1",
    name: "Lam Nguyen",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 8,
  },
  {
    id: "sug-2",
    name: "Nguyen Tuan Kiet",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 12,
  },
  {
    id: "sug-3",
    name: "Dao Cong Vinh",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 3,
  },
  {
    id: "sug-4",
    name: "Bui Quang Tan Kiet",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 6,
  },
  {
    id: "sug-5",
    name: "Duc Huy",
    avatarUrl:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 10,
  },
  {
    id: "sug-6",
    name: "Thanh Tran",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 4,
  },
  {
    id: "sug-7",
    name: "Minh Chau",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 9,
  },
  {
    id: "sug-8",
    name: "Gia Bao",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=300&h=300&q=80",
    mutualCount: 2,
  },
];

export const allFriends: FriendProfile[] = [
  {
    id: "all-1",
    name: "Thao Nguyen",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=300&h=300&q=80",
  },
  {
    id: "all-2",
    name: "Khanh Le",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=300&h=300&q=80",
  },
  {
    id: "all-3",
    name: "Huy Dao",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=300&h=300&q=80",
  },
  {
    id: "all-4",
    name: "Minh Kiet",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=300&h=300&q=80",
  },
  {
    id: "all-5",
    name: "Ha Tran",
    avatarUrl:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=facearea&w=300&h=300&q=80",
  },
];
