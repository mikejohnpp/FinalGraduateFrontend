import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { UserProfile } from '@/types/Profile'
import { MapPin, GraduationCap, Briefcase, Heart, Rss } from 'lucide-react'

interface ProfileAboutProps {
  profile: UserProfile
}

export default function ProfileAbout({ profile }: ProfileAboutProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Giới thiệu</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {profile.bio && (
          <div className="text-center">
            <p className="text-sm">{profile.bio}</p>
            {profile.isOwner && (
              <Button variant="secondary" className="w-full mt-3 h-8">
                Chỉnh sửa tiểu sử
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 mt-2">
          {profile.workplace && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="size-5 text-muted-foreground" />
              <span>
                Làm việc tại <span className="font-semibold">{profile.workplace}</span>
              </span>
            </div>
          )}
          
          {profile.education && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="size-5 text-muted-foreground" />
              <span>
                Học tại <span className="font-semibold">{profile.education}</span>
              </span>
            </div>
          )}
          
          {profile.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-5 text-muted-foreground" />
              <span>
                Sống tại <span className="font-semibold">{profile.location}</span>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Heart className="size-5 text-muted-foreground" />
            <span>Độc thân</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Rss className="size-5 text-muted-foreground" />
            <span>Có {profile.friendCount} người theo dõi</span>
          </div>
        </div>

        {profile.isOwner && (
          <Button variant="secondary" className="w-full">
            Chỉnh sửa chi tiết
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
