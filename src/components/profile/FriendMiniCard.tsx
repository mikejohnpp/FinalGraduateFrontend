import type { UserProfile } from '@/types/Profile'

interface FriendMiniCardProps {
  friend: Pick<UserProfile, 'id' | 'name' | 'avatar'>
}

export default function FriendMiniCard({ friend }: FriendMiniCardProps) {
  return (
    <div className="flex flex-col cursor-pointer gap-1">
      <div className="aspect-square w-full overflow-hidden rounded-md">
        <img
          src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}`}
          alt={friend.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <p className="text-sm font-semibold truncate leading-none mt-1">{friend.name}</p>
    </div>
  )
}
