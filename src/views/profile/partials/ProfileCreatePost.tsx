import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Video, Image as ImageIcon, Smile } from 'lucide-react'
import type { UserProfile } from '@/types/Profile'

interface ProfileCreatePostProps {
  profile: UserProfile
}

export default function ProfileCreatePost({ profile }: ProfileCreatePostProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Avatar className="size-10">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button 
            variant="outline" 
            className="flex-1 rounded-full justify-start text-muted-foreground font-normal bg-muted/50 border-none hover:bg-muted"
          >
            {profile.isOwner ? `Bạn đang nghĩ gì thế?` : `Viết gì đó cho ${profile.name}...`}
          </Button>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex justify-between gap-1">
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <Video className="text-red-500" data-icon="inline-start" />
            Video trực tiếp
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <ImageIcon className="text-green-500" data-icon="inline-start" />
            Ảnh/video
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted hidden sm:flex">
            <Smile className="text-yellow-500" data-icon="inline-start" />
            Cảm xúc
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
