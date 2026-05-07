import { ImageIcon, SmileIcon, VideoIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@/data/mock/home"

export default function CreatePostCard() {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 cursor-pointer rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80">
            Bạn đang nghĩ gì thế?
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-around">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <VideoIcon className="size-5 text-red-500" />
            <span>Video trực tiếp</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <ImageIcon className="size-5 text-emerald-500" />
            <span>Ảnh/video</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <SmileIcon className="size-5 text-amber-500" />
            <span>Cảm xúc</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
