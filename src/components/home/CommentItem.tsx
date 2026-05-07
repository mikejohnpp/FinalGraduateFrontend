import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment } from "@/types/HomeFeed"

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={comment.author.avatarUrl} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-0.5">
        <div className="rounded-xl bg-muted px-3 py-2">
          <span className="text-sm font-semibold">{comment.author.name}</span>
          <p className="text-sm leading-relaxed">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 px-1 text-xs text-muted-foreground">
          <span>{comment.time}</span>
          <button type="button" className="font-semibold hover:underline">
            Thích
          </button>
          <button type="button" className="font-semibold hover:underline">
            Phản hồi
          </button>
        </div>
      </div>
    </div>
  )
}
