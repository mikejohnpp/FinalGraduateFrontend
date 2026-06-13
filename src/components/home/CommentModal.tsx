import { useState, useRef, useCallback } from "react";
import { ThumbsUp, MessageCircle, Share2, Send, Smile, X, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IPost } from "@/types/interfaces/post/IPost";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useComments, useCreateComment, useLikeComment } from "@/hooks/useComment";
import { useLikePost } from "@/hooks/usePost";
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

export default function CommentModal({
  post,
  open,
  onClose,
}: {
  post: IPost;
  open: boolean;
  onClose: () => void;
}) {
  const { userId, username, profile } = useSelector((r: RootState) => r.user);
  const { comments, loading, hasMore, loadMore } = useComments(post.id);
  const { create, loading: sending } = useCreateComment(post.id);
  const { like: likePost, unlike: unlikePost, loadingId: postLoadingId } = useLikePost();

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const liked = post.hasLiked ?? false;

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

  const handleSend = async () => {
    const text = commentText.trim();
    if (!text || sending) return;
    setCommentText("");
    await create(text, replyingTo?.id ?? null);
    setReplyingTo(null);
  };

  const handleLikePost = async () => {
    if (!userId || postLoadingId === post.id) return;
    liked ? await unlikePost(post.id, userId) : await likePost(post.id, userId);
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
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[700px] !max-w-[700px] flex-col gap-0 overflow-x-hidden overflow-y-hidden rounded-2xl border border-border bg-card p-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Bình luận bài viết</DialogTitle>

        {/* ── Header ── */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-border px-12 py-3.5">
          <span className="text-[16px] font-bold text-foreground">Bài viết của {authorName}</span>
          <button
            onClick={onClose}
            className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Post preview */}
          <div className="px-4 pt-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-10 shrink-0">
                <AvatarImage src={authorAvatar} />
                <AvatarFallback className="text-sm font-bold">
                  {authorName.charAt(0)}
                </AvatarFallback>
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

            {post.content && (
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
                Đang trả lời{" "}
                <span className="font-semibold text-foreground">{replyingTo.name}</span>
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setCommentText("");
                }}
                className="ml-auto rounded-full p-0.5 hover:bg-muted"
              >
                <X className="size-3" />
              </button>
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
                className="max-h-[120px] flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
                <button className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <ImageIcon className="size-4" />
                </button>
                <button className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Smile className="size-4" />
                </button>
              </div>
            </div>

            <Button
              size="icon"
              disabled={!commentText.trim() || sending}
              onClick={handleSend}
              className="size-9 shrink-0 rounded-full disabled:opacity-40"
            >
              {sending ? (
                <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>

          <p className="mt-1.5 text-[11px] text-muted-foreground">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
