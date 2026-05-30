import { useState, useRef, useEffect, useCallback } from "react";
import { ThumbsUp, MessageCircle, Send, MoreHorizontal, Smile, ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IPost } from "@/types/interfaces/post/IPost";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { useComments, useCreateComment, useLikeComment } from "@/hooks/useComment";
import { useLikePost } from "@/hooks/usePost";
import CommentItem from "./CommentItem";

function PostActionBtn({
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
        "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-[13.5px] font-semibold transition-colors",
        "hover:bg-[#3a3b3c] focus-visible:outline-none",
        active ? "text-[#2d88ff]" : "text-[#b0b3b8]",
      )}
    >
      {icon}
      {label}
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
  const { userId, username } = useSelector((r: RootState) => r.user);
  const { comments, loading, hasMore, loadMore } = useComments(post.id);
  const { create, loading: sending } = useCreateComment(post.id);
  const { like, unlike } = useLikeComment(post.id);
  const { like: likePost, unlike: unlikePost, loadingId: postLoadingId } = useLikePost();

  const [commentText, setCommentText] = useState("");
  const liked = post.hasLiked ?? false;
  // Khi nhấn "Trả lời" trên comment, focus input và lưu parentId
  const [replyingTo, setReplyingTo] = useState<{ id: number; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll sentinel để load more khi cuộn đến cuối
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

  const handleLikePostClick = async () => {
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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[88vh] max-w-[500px] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-[#242526] p-0 shadow-[0_8px_40px_rgba(0,0,0,0.7)] [&>button]:hidden">
        <DialogTitle className="sr-only">Bình luận bài viết</DialogTitle>

        {/* ── Header ───────────────────────────────── */}
        <div className="relative flex items-center justify-center border-b border-[#3a3b3c] py-3.5">
          <span className="text-[17px] font-bold text-[#e4e6eb]">
            Bài viết của {post.author?.name}
          </span>
          <button
            onClick={onClose}
            className="absolute right-3 flex size-8 items-center justify-center rounded-full bg-[#3a3b3c] text-[#e4e6eb] transition-colors hover:bg-[#4a4b4c]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Scrollable content ───────────────────── */}
        <ScrollArea className="flex-1">
          {/* Post author */}
          <div className="flex items-start gap-2.5 px-4 pt-3.5">
            <Avatar className="size-10 shrink-0 rounded-lg">
              <AvatarImage src={post.author?.avatar || ""} />
              <AvatarFallback className="rounded-lg text-sm font-bold">
                {post.author?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[14px] font-semibold text-[#e4e6eb]">
                  {post.author?.name}
                </span>
                {post.authorRole && (
                  <Badge
                    variant="outline"
                    className="border-[#2d88ff44] bg-[#2d88ff15] px-1.5 py-0 text-[11px] font-semibold text-[#2d88ff]"
                  >
                    ⭐ {post.authorRole}
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[13px] text-[#b0b3b8]">
                <span>{new Date(post.createdAt).toLocaleString("vi-VN")}</span>
              </div>
            </div>
            <button className="rounded-full p-1.5 text-[#b0b3b8] transition-colors hover:bg-[#3a3b3c] hover:text-[#e4e6eb]">
              <MoreHorizontal className="size-5" />
            </button>
          </div>

          {/* Post text */}
          {post.content && (
            <p className="px-4 pt-2.5 pb-2 text-[14px] leading-relaxed text-[#e4e6eb]">
              {post.content}
            </p>
          )}

          {/* Reaction bar */}
          <div className="flex items-center justify-between px-4 py-2 text-[13px] text-[#b0b3b8]">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                <span className="flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-[#242526] bg-[#f7b928] text-[10px]">
                  😄
                </span>
                <span className="-ml-1 flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-[#242526] bg-[#2d88ff] text-[10px]">
                  👍
                </span>
              </div>
              <span>{post.likeCount}</span>
            </div>
            <span>{post.commentCount} bình luận</span>
          </div>

          {/* Action bar */}
          <div className="mx-1 flex border-y border-[#3a3b3c] py-0.5">
            <PostActionBtn
              icon={<ThumbsUp className="size-[18px]" />}
              label="Thích"
              active={liked}
              onClick={handleLikePostClick}
            />
            <PostActionBtn
              icon={<MessageCircle className="size-[18px]" />}
              label="Bình luận"
              onClick={() => setTimeout(() => inputRef.current?.focus(), 100)}
            />
            <PostActionBtn icon={<Send className="size-[18px]" />} label="Gửi" />
          </div>

          {/* Comments list */}
          <div className="flex flex-col gap-3 px-4 py-3">
            <button className="flex items-center gap-1.5 text-left">
              <span className="text-[14px] font-bold text-[#e4e6eb]">Tất cả bình luận</span>
              <ChevronDown className="size-4 text-[#b0b3b8]" />
            </button>

            {/* Initial loading skeletons */}
            {loading && comments.length === 0 && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="size-8 shrink-0 rounded-full bg-[#3a3b3c]" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-16 w-full rounded-2xl bg-[#3a3b3c]" />
                      <Skeleton className="h-3 w-32 rounded bg-[#3a3b3c]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReply={handleReply}
              />
            ))}

            {/* Load more sentinel */}
            <div ref={sentinelRef} />

            {loading && comments.length > 0 && (
              <div className="flex justify-center py-2">
                <span className="text-[13px] text-[#b0b3b8]">Đang tải thêm...</span>
              </div>
            )}

            {!loading && !hasMore && comments.length > 0 && (
              <p className="py-2 text-center text-[13px] text-[#b0b3b8]">Đã xem hết bình luận.</p>
            )}

            {!loading && comments.length === 0 && (
              <p className="py-4 text-center text-[13px] text-[#b0b3b8]">
                Hãy là người đầu tiên bình luận!
              </p>
            )}
          </div>
          <div ref={bottomRef} />
        </ScrollArea>

        {/* ── Comment input ─────────────────────────── */}
        <div className="flex flex-col gap-1 border-t border-[#3a3b3c] px-3.5 py-2.5">
          {replyingTo && (
            <div className="flex items-center gap-1 text-[12px] text-[#b0b3b8]">
              <span>
                Đang trả lời <span className="font-semibold text-[#e4e6eb]">{replyingTo.name}</span>
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setCommentText("");
                }}
                className="ml-1 text-[#b0b3b8] hover:text-[#e4e6eb]"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Avatar className="size-[34px] shrink-0">
              <AvatarImage src={post.author?.avatar || ""} />
              <AvatarFallback className="text-xs font-bold">
                {username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 items-center gap-2 rounded-full bg-[#3a3b3c] px-4 py-1.5">
              <Input
                ref={inputRef}
                placeholder={replyingTo ? `Trả lời ${replyingTo.name}...` : "Viết bình luận..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleSend();
                }}
                className="flex-1 border-none bg-transparent p-0 text-[14px] text-[#e4e6eb] shadow-none placeholder:text-[#b0b3b8] focus-visible:ring-0"
              />
              <div className="flex items-center gap-0.5">
                <button className="flex size-7 items-center justify-center rounded-full text-[#b0b3b8] transition-colors hover:bg-[#4a4b4c] hover:text-[#e4e6eb]">
                  <Smile className="size-[18px]" />
                </button>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              disabled={!commentText.trim() || sending}
              onClick={handleSend}
              className="size-8 shrink-0 rounded-full text-[#2d88ff] hover:bg-[#2d88ff22] disabled:text-[#4a4b4c]"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
