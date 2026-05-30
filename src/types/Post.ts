export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  images?: string[];
  createdAt: string; // "1 tháng 5 lúc 20:05"
  likeCount: number;
  commentCount: number;
  shareCount: number;
  hashtags?: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}
