import { HeartIcon, MessageCircleIcon, Share2Icon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { Post } from "@/types/HomeFeed"

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={post.author.avatarUrl} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{post.author.name}</span>
          <span className="text-xs text-muted-foreground">{post.time}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post image"
            className="w-full rounded-lg object-cover"
          />
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <HeartIcon className="size-3" /> {post.likes}
          </span>
          <span>{post.comments} bình luận</span>
        </div>

        <div className="flex w-full items-center justify-around border-t pt-2">
          <Button variant="ghost" size="sm">
            <HeartIcon data-icon="inline-start" />
            Thích
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircleIcon data-icon="inline-start" />
            Bình luận
          </Button>
          <Button variant="ghost" size="sm">
            <Share2Icon data-icon="inline-start" />
            Chia sẻ
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
