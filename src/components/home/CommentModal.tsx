import { useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Send,
  MoreHorizontal,
  Smile,
  Image,
  ChevronDown,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mock/home";
import type { Comment } from "@/types/HomeFeed";
import type { IPost } from "@/types/interfaces/post/IPost";

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

function FacebookCommentItem({ comment }: { comment: Comment }) {
  const [liked, setLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-2">
      {/* Avatar */}
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={comment.author.avatarUrl} />
        <AvatarFallback className="text-xs font-bold">
          {comment.author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col">
        {/* Bubble */}
        <div className="inline-block max-w-full rounded-2xl bg-[#3a3b3c] px-3 py-2">
          <p className="text-[13px] font-semibold text-[#e4e6eb]">
            {comment.author.name}
          </p>
          <p className="text-[13.5px] leading-snug text-[#e4e6eb]">
            {comment.content}
          </p>
        </div>

        {/* Actions row */}
        <div className="mt-1 flex items-center gap-3 pl-1">
          <span className="text-[12px] text-[#b0b3b8]">{comment.time}</span>
          <button
            onClick={() => setLiked((p) => !p)}
            className={cn(
              "text-[12px] font-semibold transition-colors hover:text-[#e4e6eb]",
              liked ? "text-[#2d88ff]" : "text-[#b0b3b8]",
            )}
          >
            Thích
          </button>
          <button className="text-[12px] font-semibold text-[#b0b3b8] transition-colors hover:text-[#e4e6eb]">
            Trả lời
          </button>
          {comment.likeCount ? (
            <div className="ml-auto flex items-center gap-1 text-[12px] text-[#b0b3b8]">
              <span>👍</span>
              <span>{comment.likeCount}</span>
            </div>
          ) : null}
        </div>

        {comment.replyCount ? (
          <button
            onClick={() => setShowReplies((p) => !p)}
            className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold text-[#b0b3b8] transition-colors hover:text-[#e4e6eb]"
          >
            <span className="h-px w-6 bg-[#b0b3b8]" />
            {showReplies
              ? "Ẩn phản hồi"
              : `Xem tất cả ${comment.replyCount} phản hồi`}
          </button>
        ) : null}

        {/* Replies */}
        {showReplies && comment.replies && (
          <div className="mt-2 flex flex-col gap-3 pl-2">
            {comment.replies.map((reply) => (
              <FacebookCommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
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
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        // Override default padding & sizing; hide default close button
        className="flex max-h-[88vh] max-w-[500px] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-[#242526] p-0 shadow-[0_8px_40px_rgba(0,0,0,0.7)] [&>button]:hidden"
      >
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
                {post.author.badge && (
                  <Badge
                    variant="outline"
                    className="border-[#2d88ff44] bg-[#2d88ff15] px-1.5 py-0 text-[11px] font-semibold text-[#2d88ff]"
                  >
                    ⭐ {post.author.badge}
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[13px] text-[#b0b3b8]">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <button className="rounded-full p-1.5 text-[#b0b3b8] transition-colors hover:bg-[#3a3b3c] hover:text-[#e4e6eb]">
              <MoreHorizontal className="size-5" />
            </button>
          </div>

          {/* Post text */}
          {post.content && (
            <p className="px-4 pb-2 pt-2.5 text-[14px] leading-relaxed text-[#e4e6eb]">
              {post.content}
            </p>
          )}

          {/* Post image */}
          {(post as any).image && (
            <img src={(post as any).image} alt="" className="w-full object-cover" />
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
            <span className="cursor-pointer hover:underline">
              {post.commentCount} bình luận
            </span>
          </div>

          {/* Action bar */}
          <div className="mx-1 flex border-y border-[#3a3b3c] py-0.5">
            <PostActionBtn
              icon={<ThumbsUp className="size-[18px]" />}
              label="Thích"
              active={liked}
              onClick={() => setLiked((p) => !p)}
            />
            <PostActionBtn
              icon={<MessageCircle className="size-[18px]" />}
              label="Bình luận"
            />
            <PostActionBtn
              icon={<Send className="size-[18px]" />}
              label="Gửi"
            />
          </div>

          {/* Comments list */}
          <div className="flex flex-col gap-3 px-4 py-3">
            {/* Header */}
            <button className="flex items-center gap-1.5 text-left">
              <span className="text-[14px] font-bold text-[#e4e6eb]">
                Tất cả bình luận
              </span>
              <ChevronDown className="size-4 text-[#b0b3b8]" />
            </button>

            {/* Comment items */}
            {((post as any).commentList || []).map((comment: Comment) => (
              <FacebookCommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </ScrollArea>

        {/* ── Comment input ─────────────────────────── */}
        <div className="flex items-end gap-2 border-t border-[#3a3b3c] px-3.5 py-2.5">
          <Avatar className="size-[34px] shrink-0">
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback className="text-xs font-bold">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 items-center gap-2 rounded-full bg-[#3a3b3c] px-4 py-1.5">
            <Input
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim()) {
                  setCommentText("");
                }
              }}
              className="flex-1 border-none bg-transparent p-0 text-[14px] text-[#e4e6eb] shadow-none placeholder:text-[#b0b3b8] focus-visible:ring-0"
            />
            {/* Inline actions */}
            <div className="flex items-center gap-0.5">
              <button className="flex size-7 items-center justify-center rounded-full text-[#b0b3b8] transition-colors hover:bg-[#4a4b4c] hover:text-[#e4e6eb]">
                <Smile className="size-[18px]" />
              </button>
              <button className="flex size-7 items-center justify-center rounded-full text-[#b0b3b8] transition-colors hover:bg-[#4a4b4c] hover:text-[#e4e6eb]">
                <Image className="size-[18px]" />
              </button>
              <button className="flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-[#b0b3b8] transition-colors hover:bg-[#4a4b4c] hover:text-[#e4e6eb]">
                GIF
              </button>
            </div>
          </div>

          {/* Send */}
          <Button
            size="icon"
            variant="ghost"
            disabled={!commentText.trim()}
            onClick={() => {
              if (commentText.trim()) setCommentText("");
            }}
            className="size-8 shrink-0 rounded-full text-[#2d88ff] hover:bg-[#2d88ff22] disabled:text-[#4a4b4c]"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
