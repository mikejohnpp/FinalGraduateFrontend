import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { timeAgo } from "@/utils/stringHelper";
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";
import type { IGroupAdminPost } from "@/types/interfaces/group/IGroupAdminPost";

export default function GroupPostCard({ post }: { post: IGroupAdminPost }) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-start p-4 space-y-0">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="size-10">
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
            <AvatarFallback>{post.authorName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{post.authorName}</span>
            <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
              <MoreHorizontal className="size-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xóa bài viết</DropdownMenuItem>
            <DropdownMenuItem>Tắt bình luận</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-sm mt-3 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <Separator />
      <CardFooter className="p-2 gap-1 justify-between text-muted-foreground">
        <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:bg-accent hover:text-foreground">
          <ThumbsUp className="size-4" />
          <span>Thích</span>
        </Button>
        <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:bg-accent hover:text-foreground">
          <MessageSquare className="size-4" />
          <span>Bình luận</span>
        </Button>
        <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:bg-accent hover:text-foreground">
          <Share2 className="size-4" />
          <span>Gửi</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
