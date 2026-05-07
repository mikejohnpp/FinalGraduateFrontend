export interface Story {
  id: string
  name: string
  avatarUrl: string
  imageUrl?: string
  isViewed?: boolean
}

export interface Post {
  id: string
  author: {
    name: string
    avatarUrl: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  time: string
}

export interface Contact {
  id: string
  name: string
  avatarUrl: string
  isOnline: boolean
}

export interface Shortcut {
  id: string
  label: string
  icon: string
}

export interface CurrentUser {
  name: string
  avatarUrl: string
}
