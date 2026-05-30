import type { IAuthor } from '@/types/interfaces/user/IAuthor'
import { resolveUploadUrl } from '@/utils/uploadHelper'

interface FriendMiniCardProps {
  friend: IAuthor
}

export default function FriendMiniCard({ friend }: FriendMiniCardProps) {
  const avatarSrc = resolveUploadUrl(friend.avatar) ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}`

  return (
    <div className="flex flex-col cursor-pointer gap-1">
      <div className="aspect-square w-full overflow-hidden rounded-md">
        <img
          src={avatarSrc}
          alt={friend.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <p className="text-sm font-semibold truncate leading-none mt-1">{friend.name}</p>
    </div>
  )
}
