import { useState, useEffect } from "react";
import { ThumbsUp, MoreHorizontal, CornerDownRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IComment } from "@/types/interfaces/comment/IComment";
import {
  useReplies,
  useCreateComment,
  useLikeComment,
  useDeleteComment,
  useEditComment,
} from "@/hooks/useComment";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import SentimentIndicator from "./SentimentIndicator";
import MediaGallery from "@/components/media/MediaGallery";
import { countWords, limitWords } from "@/utils/stringHelper";

const MAX_COMMENT_WORDS = 40;



interface CommentItemProps {
  comment: IComment;
  postId: number;
  onReply?: (commentId: number, authorName: string) => void;
  /** Đánh dấu highlight khi mở từ thông báo (cuộn tới bình luận này). */
  highlight?: boolean;
}

function TimeAgo({ dateStr }: { dateStr: string }) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return <span>Vừa xong</span>;
  if (diffMins < 60) return <span>{diffMins} phút</span>;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return <span>{diffHrs} giờ</span>;
  return <span>{date.toLocaleDateString("vi-VN")}</span>;
}

function ReplyBubble({
  reply,
  postId,
  parentId,
}: {
  reply: IComment;
  postId: number;
  parentId: number;
}) {
  const { like, unlike } = useLikeComment(postId);

  return (
    <div className="flex gap-2">
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={reply.author.avatar ?? ""} />
        <AvatarFallback className="text-[10px] font-bold">
          {reply.author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col">
        <div className="group relative inline-block max-w-full rounded-2xl bg-muted ring-1 ring-border/40 px-3 py-2">
          <p className="text-[12px] font-semibold text-foreground">{reply.author.name}</p>
          {reply.content && (
            <p className="text-[13px] leading-snug text-foreground">{reply.content}</p>
          )}
          {reply.media?.length > 0 && (
            <MediaGallery media={reply.media} size="comment" className="mt-1.5" />
          )}

          {reply.likeCount > 0 && (

            <div className="absolute -right-1 -bottom-2 flex items-center gap-0.5 rounded-full border border-border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground shadow-sm">
              <ThumbsUp className="size-2.5 fill-primary text-primary" />
              <span>{reply.likeCount}</span>
            </div>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-3 pl-1.5">
          <span className="text-[11px] text-muted-foreground">
            <TimeAgo dateStr={reply.createdAt} />
          </span>
          <SentimentIndicator data={reply} />
          <button
            onClick={() => (reply.liked ? unlike(reply.id, parentId) : like(reply.id, parentId))}
            className={cn(
              "text-[12px] font-semibold transition-colors hover:underline",
              reply.liked ? "text-primary" : "text-muted-foreground",
            )}
          >
            Thích
          </button>
        </div>
      </div>
    </div>
  );
}

function ReplyList({ comment, postId }: { comment: IComment; postId: number }) {
  const { replies, loading, hasMore, loaded, load, loadMore } = useReplies(postId, comment.id);
  const { create } = useCreateComment(postId);
  const { userId } = useSelector((r: RootState) => r.user);
  const [replyText, setReplyText] = useState("");

  const handleSend = async () => {
    if (!replyText.trim()) return;
    await create(replyText.trim(), comment.id);
    setReplyText("");
  };

  if (!loaded) {
    return (
      <button
        onClick={load}
        className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="h-px w-5 bg-border" />
        {loading ? "Đang tải..." : `Xem ${comment.replyCount} phản hồi`}
      </button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2 border-l-2 border-border pl-3">
      {replies.map((reply) => (
        <ReplyBubble key={reply.id} reply={reply} postId={postId} parentId={comment.id} />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="text-left text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          {loading ? "Đang tải..." : "Xem thêm phản hồi"}
        </button>
      )}

      {userId && (
        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 transition-colors focus-within:border-ring focus-within:bg-background">
            <input
              placeholder="Viết phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(limitWords(e.target.value, MAX_COMMENT_WORDS))}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            <span className="text-[10px] text-muted-foreground shrink-0">
              {countWords(replyText)}/{MAX_COMMENT_WORDS} từ
            </span>

          </div>
        </div>
      )}
    </div>
  );
}

export default function CommentItem({ comment, postId, onReply, highlight }: CommentItemProps) {
  const { userId } = useSelector((r: RootState) => r.user);
  const { like, unlike } = useLikeComment(postId);
  const { remove } = useDeleteComment(postId);
  const { edit } = useEditComment(postId);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  useEffect(() => {
    setEditText(comment.content);
  }, [comment.content]);

  const handleLike = () => {
    comment.liked ? unlike(comment.id, comment.parentId) : like(comment.id, comment.parentId);
  };

  const handleEdit = async () => {
    if (editText.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    const ok = await edit(comment.id, editText);
    if (ok) setIsEditing(false);
  };

  const isOwner = userId === comment.author.id;

  return (
    <div
      data-comment-id={comment.id}
      className={cn(
        "flex gap-2.5 rounded-xl py-1 transition-colors duration-500",
        highlight && "bg-primary/10 ring-1 ring-primary/30",
      )}
    >
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={comment.author.avatar ?? ""} />
        <AvatarFallback className="text-xs font-bold">
          {comment.author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col">
        <div className="group relative inline-block max-w-full rounded-2xl bg-muted ring-1 ring-border/40 px-3.5 py-2.5">
          <p className="mb-0.5 text-[13px] font-semibold text-foreground">{comment.author.name}</p>

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                autoFocus
                rows={2}
                value={editText}
                onChange={(e) => setEditText(limitWords(e.target.value, MAX_COMMENT_WORDS))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEdit();
                  }
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }
                }}
                className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-foreground outline-none"
              />
              <div className="text-right text-[10px] text-muted-foreground mb-1">
                {countWords(editText)}/{MAX_COMMENT_WORDS} từ
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="rounded-lg bg-primary px-2.5 py-1 text-[12px] font-semibold text-primary-foreground hover:opacity-90"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                  className="rounded-lg px-2.5 py-1 text-[12px] font-semibold text-muted-foreground hover:bg-accent"
                >
                  Huỷ
                </button>
              </div>
            </div>
          ) : (
            <>
              {comment.content && (
                <p className="text-[13.5px] leading-snug text-foreground">{comment.content}</p>
              )}
              {comment.media?.length > 0 && (
                <MediaGallery media={comment.media} size="comment" className="mt-1.5" />
              )}
            </>
          )}

          {/* Like count pill */}

          {comment.likeCount > 0 && !isEditing && (
            <div className="absolute -right-1 -bottom-2.5 flex items-center gap-0.5 rounded-full border border-border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground shadow-sm">
              <ThumbsUp className="size-2.5 fill-primary text-primary" />
              <span>{comment.likeCount}</span>
            </div>
          )}

          {/* Owner actions dropdown */}
          {isOwner && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="absolute top-1.5 -right-9 flex size-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-accent hover:text-foreground">
                    <MoreHorizontal className="size-4" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>Chỉnh sửa</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => remove(comment.id, comment.parentId)}
                  className="text-destructive focus:text-destructive"
                >
                  Xóa bình luận
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Meta row */}
        <div className="mt-1.5 flex items-center gap-3 pl-1.5">
          <span className="text-[11px] text-muted-foreground">
            <TimeAgo dateStr={comment.createdAt} />
          </span>
          <SentimentIndicator data={comment} />
          <button
            onClick={handleLike}
            className={cn(
              "text-[12px] font-semibold transition-colors hover:underline",
              comment.liked ? "text-primary" : "text-muted-foreground",
            )}
          >
            Thích
          </button>
          {comment.parentId === null && (
            <button
              onClick={() => {
                setShowReplies(true);
                onReply?.(comment.id, comment.author.name);
              }}
              className="flex items-center gap-1 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline"
            >
              <CornerDownRight className="size-3" />
              Trả lời
            </button>
          )}
        </div>

        {/* Replies */}
        {comment.parentId === null && (comment.replyCount > 0 || showReplies) && (
          <div className="mt-1.5 pl-1">
            {showReplies ? (
              <ReplyList comment={comment} postId={postId} />
            ) : (
              <button
                onClick={() => setShowReplies(true)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="h-px w-5 bg-border" />
                Xem {comment.replyCount} phản hồi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
