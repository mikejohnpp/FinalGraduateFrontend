import { Loader2, Smile } from "lucide-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmojiPickerReact from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useCreatePost } from "@/hooks/usePost";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import MediaPicker from "@/components/media/MediaPicker";
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

const MAX_POST_LEN = 40;

export default function CreatePostCard({ groupId, onPostCreated }: CreatePostCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { create, loading, error } = useCreatePost();
  const { drafts, uploading, addFiles, removeDraft, clear, upload } = useMediaUpload();
  const { userId, username, profile } = useSelector((r: RootState) => r.user);

  const userAvatar = profile?.avatar || undefined;
  const displayName = profile?.nickName || profile?.userName || username || "Người dùng";
  const initial = displayName.charAt(0).toUpperCase();

  const busy = loading || uploading;
  const canSubmit = (content.trim().length > 0 || drafts.length > 0) && !busy;

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setContent((prev) => (prev + emoji.emoji).slice(0, MAX_POST_LEN));
    setTimeout(() => textareaRef.current?.focus(), 0);
  };


  const handleCreatePost = async () => {
    if (!canSubmit || !userId) return;

    // Upload media lên Supabase trước, lấy URL rồi đính vào body
    const media = await upload();
    if (media === null) return; // upload lỗi (toast đã hiển thị trong hook)

    const result = await create({
      content,
      userId,
      ...(groupId ? { groupId, isGroupPosted: true } : {}),
      ...(media.length > 0 ? { media } : {}),
    });

    if (result) {
      if (result.status === "PENDING") {
        toast.success("Bài viết của bạn đã được gửi và đang chờ phê duyệt");
      } else {
        toast.success("Bài viết đã được đăng thành công");
        if (onPostCreated) {
          onPostCreated({ ...result, commentCount: 0 } as IPost);
        }
      }
      setContent("");
      clear();
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (busy) return;
    setIsOpen(open);
    if (!open) {
      setContent(""); // Optionally clear content on close
      clear();
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
                  ref={textareaRef}
                  placeholder={`${displayName} ơi, bạn đang nghĩ gì thế?`}
                  className="min-h-[150px] w-full resize-none border-none bg-transparent p-0 text-lg outline-none placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={busy}
                  maxLength={40}
                />
                <div className="flex items-center justify-between">
                  <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                    <PopoverTrigger
                      render={
                        <button
                          type="button"
                          disabled={busy}
                          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
                        />
                      }
                    >
                      <Smile className="size-5" />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto border-none p-0 shadow-none">
                      <EmojiPickerReact onEmojiClick={handleEmojiClick} />
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-muted-foreground">{content.length}/40</span>
                </div>


                <MediaPicker
                  variant="dropzone"
                  drafts={drafts}
                  onAdd={addFiles}
                  onRemove={removeDraft}
                  disabled={busy}
                />

                {error && <div className="text-sm text-destructive">{error}</div>}
              </div>

              <DialogFooter>
                <Button className="w-full" disabled={!canSubmit} onClick={handleCreatePost}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {uploading ? "Đang tải media..." : "Đăng bài"}
                </Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
