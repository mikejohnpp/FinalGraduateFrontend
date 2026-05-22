import type { GroupPost } from "@/types/GroupPost";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupPostCardProps {
  post: GroupPost;
}

export default function GroupPostCard({ post }: GroupPostCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between px-4 pb-2 pt-4">
        <div className="flex gap-2">
          <Avatar className="relative size-10 overflow-visible border">
            <AvatarImage src={`https://picsum.photos/seed/${post.groupId}/100/100`} />
            <AvatarFallback>{post.groupName.charAt(0)}</AvatarFallback>
            <Avatar className="absolute -bottom-1 -right-1 size-5 border-2 border-background">
              <AvatarImage src={`https://i.pravatar.cc/100?u=${post.authorId}`} />
              <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-1">
              <p className="font-semibold">{post.groupName}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.authorName}</span>
              {post.authorRole && (
                <>
                  <span>·</span>
                  <span>{post.authorRole}</span>
                </>
              )}
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                <MoreHorizontal data-icon="inline" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Lưu bài viết</DropdownMenuItem>
            <DropdownMenuItem>Ẩn bài viết</DropdownMenuItem>
            <DropdownMenuItem>Báo cáo bài viết</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-0 pb-2">
        <p className="mb-3 px-4 whitespace-pre-wrap">{post.content}</p>
        
        {/* Images Grid */}
        {post.images && post.images.length > 0 && (
          <div className={cn("grid gap-[1px]", 
            post.images.length === 1 ? "grid-cols-1" :
            post.images.length === 2 ? "grid-cols-2" : 
            post.images.length === 3 ? "grid-cols-2" : "grid-cols-2"
          )}>
            {post.images.map((img, idx) => (
              <div key={idx} className={cn(
                "relative bg-muted",
                post.images!.length === 3 && idx === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"
              )}>
                <img src={img} alt="" className="size-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Link Preview */}
        {post.linkPreview && (
          <div className="px-4 pb-2">
            <Card className="cursor-pointer overflow-hidden bg-muted/30 transition-colors hover:bg-muted/50">
              {post.linkPreview.image && (
                <img src={post.linkPreview.image} alt={post.linkPreview.title} className="aspect-[16/8] w-full object-cover" />
              )}
              <div className="p-3">
                <p className="mb-1 text-xs uppercase text-muted-foreground">{new URL(post.linkPreview.url).hostname}</p>
                <p className="line-clamp-2 font-semibold">{post.linkPreview.title}</p>
                {post.linkPreview.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{post.linkPreview.description}</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Reaction Bar */}
        <div className="mt-2 flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ThumbsUp className="size-2.5 fill-current" />
            </div>
            <span>{post.likeCount}</span>
          </div>
          <div className="flex gap-3">
            <span>{post.commentCount} bình luận</span>
            <span>{post.shareCount} chia sẻ</span>
          </div>
        </div>

        <div className="px-4">
          <Separator />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between px-2 py-1">
          <Button variant="ghost" className="flex-1 rounded-sm text-muted-foreground">
            <ThumbsUp data-icon="inline-start" /> Thích
          </Button>
          <Button variant="ghost" className="flex-1 rounded-sm text-muted-foreground">
            <MessageCircle data-icon="inline-start" /> Bình luận
          </Button>
          <Button variant="ghost" className="flex-1 rounded-sm text-muted-foreground">
            <Share2 data-icon="inline-start" /> Chia sẻ
          </Button>
        </div>

        {/* Comments Section */}
        {post.topComments && post.topComments.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="px-4">
              <Separator />
            </div>
            <div className="flex flex-col gap-3 px-4 pb-1 pt-3">
              <Button variant="link" className="mb-1 h-auto px-0 font-medium text-muted-foreground">
                Xem thêm bình luận
              </Button>
              {post.topComments.map(comment => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={`https://i.pravatar.cc/100?u=${comment.authorId}`} />
                    <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="inline-block rounded-2xl bg-muted px-3 py-2">
                      <p className="text-sm font-semibold">{comment.authorName}</p>
                      <p>{comment.content}</p>
                    </div>
                    <div className="mt-1 flex gap-4 px-2 text-xs font-medium text-muted-foreground">
                      <span className="cursor-pointer hover:underline">Thích</span>
                      <span className="cursor-pointer hover:underline">Phản hồi</span>
                      <span className="font-normal">{comment.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment Input */}
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="size-8">
            <AvatarImage src="https://i.pravatar.cc/100?u=me" />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <div className="relative flex-1">
            <Input 
              placeholder="Viết bình luận..." 
              className="rounded-full border-transparent bg-muted/50 pr-10 focus-visible:bg-background" 
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-full text-primary hover:bg-primary/10 hover:text-primary">
              <Send data-icon="inline" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
