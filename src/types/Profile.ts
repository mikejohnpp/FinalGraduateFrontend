export interface UserProfile {
  id: string
  name: string
  avatar?: string
  coverPhoto?: string
  friendCount: number
  bio?: string
  location?: string
  education?: string
  workplace?: string
  hometown?: string
  birthday?: string
  relationship?: string
  gender?: string
  pronouns?: string
  language?: string
  isOwner: boolean           // true nếu đang xem profile của chính mình
}
