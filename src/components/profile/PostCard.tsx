import type { Post } from '@/types/Post'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Ellipsis, ThumbsUp, MessageSquare, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center p-4">
        <Avatar className="size-10 mr-3">
          <AvatarImage src={post.authorAvatar} alt={post.authorName} />
          <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <p className="text-sm font-semibold hover:underline cursor-pointer">{post.authorName}</p>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full size-8 -mr-2">
              <Ellipsis className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Lưu bài viết</DropdownMenuItem>
            <DropdownMenuItem>Ẩn bài viết</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-0 pb-3">
        <p className="px-4 text-sm mb-3">
          {post.content}
          {post.hashtags && (
            <span className="text-primary block mt-1">
              {post.hashtags.map(tag => (
                <span key={tag} className="hover:underline cursor-pointer mr-1">{tag}</span>
              ))}
            </span>
          )}
        </p>

        {post.images && post.images.length > 0 && (
          <div className={cn("grid gap-1", post.images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
            {post.images.map((img, idx) => (
              <img key={idx} src={img} alt="Post image" className="w-full object-cover max-h-96" />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-muted-foreground text-sm px-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="bg-blue-500 rounded-full p-1 size-5 flex items-center justify-center">
              <ThumbsUp className="text-white size-3" />
            </div>
            <span>{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hover:underline cursor-pointer">{post.commentCount} bình luận</span>
            <span className="hover:underline cursor-pointer">{post.shareCount} lượt chia sẻ</span>
          </div>
        </div>
      </CardContent>

      <Separator className="mx-4 w-auto" />

      <CardFooter className="flex flex-col p-2">
        <div className="flex w-full px-2 gap-1 mb-2">
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <ThumbsUp data-icon="inline-start" />
            Thích
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <MessageSquare data-icon="inline-start" />
            Bình luận
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <Share2 data-icon="inline-start" />
            Chia sẻ
          </Button>
        </div>

        <div className="flex w-full items-center gap-2 px-2 pb-2">
          <Avatar className="size-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Current User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Input className="h-9 rounded-full bg-muted/50 border-none" placeholder="Viết bình luận..." />
        </div>
      </CardFooter>
    </Card>
  )
}
