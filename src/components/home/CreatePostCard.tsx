import { ImageIcon, SmileIcon, VideoIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/hooks/usePost";
import type { RootState } from "@/stores/store";
import type { IPost } from "@/types/interfaces/post/IPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CreatePostCardProps {
  groupId?: number;
  onPostCreated?: (post: IPost) => void;
}

export default function CreatePostCard({ groupId, onPostCreated }: CreatePostCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const { create, loading, error } = useCreatePost();
  const { userId, username, profile } = useSelector((r: RootState) => r.user);

  const userAvatar = profile?.avatar || undefined;
  const displayName = profile?.nickName || profile?.userName || username || "Người dùng";
  const initial = displayName.charAt(0).toUpperCase();

  const handleCreatePost = async () => {
    if (!content.trim() || !userId) return;

    const result = await create({
      content,
      userId,
      ...(groupId ? { groupId, isGroupPosted: true } : {}),
    });

    if (result) {
      if (result.status === "PENDING") {
        toast.success("Bài viết của bạn đã được gửi và đang chờ phê duyệt");
      } else {
        toast.success("Bài viết đã được đăng thành công");
        if (onPostCreated) {
          onPostCreated({ ...result, commentCount: 0 } as any);
        }
      }
      setContent("");
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (loading) return;
    setIsOpen(open);
    if (!open) {
      setContent(""); // Optionally clear content on close
    }
  };

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="flex flex-1 cursor-pointer rounded-full bg-muted px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/80"
                />
              }
            >
              {username ? `${username} ơi, bạn đang nghĩ gì thế?` : "Bạn đang nghĩ gì thế?"}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-center">Tạo bài viết</DialogTitle>
              </DialogHeader>

              <Separator className="-mx-4" />

              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{displayName}</div>
                  </div>
                </div>

                <textarea
                  placeholder={`${displayName} ơi, bạn đang nghĩ gì thế?`}
                  className="min-h-[150px] w-full resize-none border-none bg-transparent p-0 text-lg outline-none placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  maxLength={40}
                />
                <div className="text-right text-xs text-muted-foreground">{content.length}/40</div>

                {error && <div className="text-sm text-destructive">{error}</div>}
              </div>

              <DialogFooter>
                <Button
                  className="w-full"
                  disabled={!content.trim() || loading}
                  onClick={handleCreatePost}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng bài
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
