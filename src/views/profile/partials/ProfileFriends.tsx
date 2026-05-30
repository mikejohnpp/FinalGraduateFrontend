import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FriendMiniCard from '@/components/profile/FriendMiniCard'
import type { UserProfileDTO } from '@/types/interfaces/user/UserProfileDTO'
import type { IAuthor } from '@/types/interfaces/user/IAuthor'
import type { IFriendship } from '@/types/interfaces/friend/IFriendship'
import type { CursorPageResponse } from '@/types/interfaces/post/IPostPage'
import { useEffect, useState } from 'react'
import { API } from '@/common/constants'
import friendService from '@/services/friendService'

interface ProfileFriendsProps {
  profile: UserProfileDTO
}

export default function ProfileFriends({ profile }: ProfileFriendsProps) {
  const [friends, setFriends] = useState<IAuthor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profile.id) return
    const fetchFriends = async () => {
      setLoading(true)
      try {
        // GET /users/friends?userId={userId}&cursor=&size=6 (preview 6 bạn)
        const result = await friendService.getSingle<CursorPageResponse<IFriendship>>(
          API.FRIEND.BASE,
          undefined,
          { userId: profile.id, size: 6 }
        )
        setFriends(result?.data?.map(f => f.user) ?? [])
      } catch {
        // Silently fail — không hiện lỗi trong widget nhỏ
      } finally {
        setLoading(false)
      }
    }
    fetchFriends()
  }, [profile.id])

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
        {loading ? (
          <div className="text-sm text-muted-foreground text-center py-4">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {friends.map(friend => (
              <FriendMiniCard key={friend.id} friend={friend} />
            ))}
            {friends.length === 0 && !loading && (
              <p className="col-span-3 text-sm text-muted-foreground text-center py-4">
                Chưa có bạn bè nào
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
