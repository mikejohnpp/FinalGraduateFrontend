export interface IStoryRequest {
  userId: number;
  content?: string;
  urlImage?: string;
  urlVideo?: string;
  type: "STORY";
  color?: string;
}

export interface IStoryUser {
  id: number;
  username: string;
  avatarUrl?: string;
}

export interface IStoryDTO {
  id: number;
  content: string | null;
  urlImage: string | null;
  urlVideo: string | null;
  user: IStoryUser;
  createdAt: string;
  isActive: boolean;
  type: string;
  color: string | null;
}

export interface IGroupedStory {
  user: IStoryUser;
  stories: IStoryDTO[];
  hasUnread?: boolean;
}
