import { useState, useRef, useCallback } from "react";
import { ThumbsUp, MessageCircle, Share2, Send, Smile } from "lucide-react";
import EmojiPickerReact from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IPost } from "@/types/interfaces/post/IPost";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useComments, useCreateComment } from "@/hooks/useComment";
import { useLikePost } from "@/hooks/usePost";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import MediaPicker from "@/components/media/MediaPicker";
import CommentItem from "./CommentItem";

function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-[13.5px] font-semibold transition-all duration-150",
        "hover:bg-accent focus-visible:outline-none",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/**
 * Panel dùng chung cho phần "nội dung bài viết + bình luận + ô nhập".
 * Dùng bởi cả CommentModal (dialog 700px) và MediaLightbox (cột phải kiểu Facebook).
 *
 * - `showPostContent`: có hiển thị nội dung text của bài viết trong panel hay không
 *   (lightbox vẫn hiển thị để giống Facebook, mặc định true).
 */
export default function PostCommentPanel({
  post,
  showPostContent = true,
}: {
  post: IPost;
  showPostContent?: boolean;
}) {
  const { userId, username, profile } = useSelector((r: RootState) => r.user);
  const { comments, loading, hasMore, loadMore } = useComments(post.id);
  const { create, loading: sending } = useCreateComment(post.id);
  const { like: likePost, unlike: unlikePost, loadingId: postLoadingId } = useLikePost();
  const { drafts, uploading, addFiles, removeDraft, clear, upload } = useMediaUpload();

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const liked = post.hasLiked ?? false;

  const MAX_COMMENT_LEN = 40;

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setCommentText((prev) => (prev + emoji.emoji).slice(0, MAX_COMMENT_LEN));
    setTimeout(() => inputRef.current?.focus(), 0);
  };


  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  const busy = sending || uploading;

  const handleSend = async () => {
    const text = commentText.trim();
    if ((!text && drafts.length === 0) || busy) return;

    // Upload media lên Supabase trước, lấy URL rồi đính vào body
    const media = await upload();
    if (media === null) return; // upload lỗi (toast đã hiển thị trong hook)

    setCommentText("");
    await create(text, replyingTo?.id ?? null, media.length > 0 ? media : undefined);
    clear();
    setReplyingTo(null);
  };

  const handleLikePost = async () => {
    if (!userId || postLoadingId === post.id) return;
    if (liked) {
      await unlikePost(post.id, userId);
    } else {
      await likePost(post.id, userId);
    }

  };

  const handleReply = (commentId: number, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    setCommentText(`@${authorName} `);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const authorName = post.author?.name || "Người dùng";
  const authorAvatar = post.author?.avatar || "";
  const myAvatar = profile?.avatar || "";

  return (
    <>
      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Post preview */}
        <div className="px-4 pt-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback className="text-sm font-bold">{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[14px] font-semibold text-foreground">{authorName}</span>
                {post.authorRole && (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[11px] font-semibold">
                    ⭐ {post.authorRole}
                  </Badge>
                )}
              </div>
              <span className="text-[12px] text-muted-foreground">
                {new Date(post.createdAt).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>

          {showPostContent && post.content && (
            <p className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap text-foreground">
              {post.content}
            </p>
          )}

          {/* Reaction counts */}
          <div className="mt-3 flex items-center justify-between pb-2 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <span className="flex size-[18px] items-center justify-center rounded-full border-2 border-card bg-amber-400 text-[9px]">
                  😄
                </span>
                <span className="flex size-[18px] items-center justify-center rounded-full border-2 border-card bg-primary text-[9px] text-primary-foreground">
                  👍
                </span>
              </div>
              <span>{post.likeCount}</span>
            </div>
            <span>{post.commentCount} bình luận</span>
          </div>
        </div>

        <Separator />

        {/* Action buttons */}
        <div className="flex px-2 py-1">
          <ActionButton
            icon={<ThumbsUp className={cn("size-[18px]", liked && "fill-current")} />}
            label="Thích"
            active={liked}
            onClick={handleLikePost}
          />
          <ActionButton
            icon={<MessageCircle className="size-[18px]" />}
            label="Bình luận"
            onClick={() => setTimeout(() => inputRef.current?.focus(), 100)}
          />
          <ActionButton icon={<Share2 className="size-[18px]" />} label="Chia sẻ" />
        </div>

        <Separator />

        {/* Comments */}
        <div className="flex flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-foreground">Bình luận nổi bật</span>
            <button className="text-[12px] font-semibold text-primary hover:underline">
              Mới nhất
            </button>
          </div>
          {loading && comments.length === 0 ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2.5">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-3 w-28 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
              <MessageCircle className="size-10 opacity-30" />
              <p className="text-[13px]">Hãy là người đầu tiên bình luận!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReply={handleReply}
              />
            ))
          )}

          <div ref={sentinelRef} />

          {loading && comments.length > 0 && (
            <div className="flex items-center justify-center gap-2 py-3 text-[13px] text-muted-foreground">
              <div className="size-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
              Đang tải thêm...
            </div>
          )}

          {!loading && !hasMore && comments.length > 0 && (
            <p className="py-2 text-center text-[12px] text-muted-foreground">
              Đã xem hết bình luận
            </p>
          )}
        </div>
      </div>

      {/* ── Comment input ── */}
      <div className="shrink-0 border-t border-border bg-card px-4 py-3">
        {replyingTo && (
          <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[12px] text-muted-foreground">
            <span>
              Đang trả lời <span className="font-semibold text-foreground">{replyingTo.name}</span>
            </span>
            <button
              onClick={() => {
                setReplyingTo(null);
                setCommentText("");
              }}
              className="ml-auto rounded-full p-0.5 hover:bg-muted"
            >
              <span className="sr-only">Huỷ trả lời</span>×
            </button>
          </div>
        )}

        {drafts.length > 0 && (
          <div className="mb-2">
            <MediaPicker drafts={drafts} onAdd={addFiles} onRemove={removeDraft} disabled={busy} />
          </div>
        )}

        <div className="flex items-end gap-2.5">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={myAvatar} />
            <AvatarFallback className="text-xs font-bold">
              {username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 items-end gap-1.5 rounded-2xl border border-border bg-muted/50 px-3.5 py-2 transition-colors focus-within:border-ring focus-within:bg-background">
            <textarea
              ref={inputRef}
              rows={1}
              placeholder={replyingTo ? `Trả lời ${replyingTo.name}...` : "Viết bình luận..."}
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              maxLength={40}
              className="max-h-[120px] flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
              <MediaPicker
                drafts={[]}
                onAdd={addFiles}
                onRemove={removeDraft}
                disabled={busy}
              />
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    />
                  }
                >
                  <Smile className="size-4" />
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-auto border-none p-0 shadow-none"
                >
                  <EmojiPickerReact onEmojiClick={handleEmojiClick} />
                </PopoverContent>
              </Popover>

            </div>
          </div>

          <Button
            size="icon"
            disabled={(!commentText.trim() && drafts.length === 0) || busy}
            onClick={handleSend}
            className="size-9 shrink-0 rounded-full disabled:opacity-40"
          >
            {busy ? (
              <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>

        <div className="mt-1.5 flex items-center justify-between px-1">
          <p className="text-[11px] text-muted-foreground">
            Nhấn{" "}
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            để gửi,{" "}
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              Shift+Enter
            </kbd>{" "}
            xuống dòng
          </p>
          <span className="text-[11px] text-muted-foreground">{commentText.length}/40</span>
        </div>
      </div>
    </>
  );
}
