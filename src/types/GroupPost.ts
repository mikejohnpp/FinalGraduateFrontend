export interface GroupComment {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  likeCount: number
  replyCount?: number
}

export interface GroupPost {
  id: string
  groupId: string
  groupName: string
  groupAvatar?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  authorRole?: string             // "Người tham gia ẩn danh", "Người đóng góp nổi bật"
  content: string
  images?: string[]
  linkPreview?: {
    url: string
    title: string
    description?: string
    image?: string
  }
  createdAt: string
  likeCount: number
  commentCount: number
  shareCount: number
  topComments?: GroupComment[]
}
