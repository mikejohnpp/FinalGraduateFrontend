export interface Story {
  id: string;
  name: string;
  avatarUrl: string;
  imageUrl?: string;
  isViewed?: boolean;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  time: string;
  likeCount?: number;
  replyCount?: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    subName?: string;
    badge?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  commentList: Comment[];
  time: string;
  reactionCount?: number;
  commentCount?: number;
}
export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface Shortcut {
  id: string;
  label: string;
  icon: string;
  to?: string;
}

export interface CurrentUser {
  name: string;
  avatarUrl: string;
}
