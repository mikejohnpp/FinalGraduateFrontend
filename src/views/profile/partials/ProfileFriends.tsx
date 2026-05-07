import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FriendMiniCard from '@/components/profile/FriendMiniCard'
import type { UserProfile } from '@/types/Profile'

interface ProfileFriendsProps {
  profile: UserProfile
}

// Giả lập danh sách bạn bè hiển thị trên profile
const mockFriendsList = [
  { id: 'f1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'f2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'f3', name: 'Lê Hoàng C', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'f4', name: 'Phạm D', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'f5', name: 'Hoàng E', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'f6', name: 'Vũ F', avatar: 'https://i.pravatar.cc/150?u=6' },
]

export default function ProfileFriends({ profile }: ProfileFriendsProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold hover:underline cursor-pointer">Bạn bè</CardTitle>
          <p className="text-sm text-muted-foreground">{profile.friendCount} người bạn</p>
        </div>
        <Button variant="link" className="text-primary p-0 h-auto font-normal">
          Xem tất cả bạn bè
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {mockFriendsList.map(friend => (
            <FriendMiniCard key={friend.id} friend={friend} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
