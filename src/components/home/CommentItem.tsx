import { useState, useRef, useEffect } from "react";
import { ThumbsUp, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { IComment } from "@/types/interfaces/comment/IComment";
import { useReplies, useCreateComment, useLikeComment, useDeleteComment, useEditComment } from "@/hooks/useComment";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

interface CommentItemProps {
  comment: IComment;
  postId: number;
  onReply?: (commentId: number, authorName: string) => void;
}

function ReplyList({ comment, postId }: { comment: IComment; postId: number }) {
  const { replies, loading, hasMore, loaded, load, loadMore } = useReplies(postId, comment.id);
  const { create } = useCreateComment(postId);
  const { like, unlike } = useLikeComment(postId);
  const { userId } = useSelector((r: RootState) => r.user);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    await create(replyText.trim(), comment.id);
    setReplyText("");
  };

  if (!loaded) {
    return (
      <button
        onClick={load}
        className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold text-[#b0b3b8] transition-colors hover:text-[#e4e6eb]"
      >
        <span className="h-px w-6 bg-[#b0b3b8]" />
        {loading ? "Đang tải..." : `Xem tất cả ${comment.replyCount} phản hồi`}
      </button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2 pl-2">
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-2">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={reply.author.avatar ?? ""} />
            <AvatarFallback className="text-xs font-bold">{reply.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <div className="inline-block max-w-full rounded-2xl bg-[#3a3b3c] px-3 py-2">
              <p className="text-[13px] font-semibold text-[#e4e6eb]">{reply.author.name}</p>
              <p className="text-[13.5px] leading-snug text-[#e4e6eb]">{reply.content}</p>
            </div>
            <div className="mt-1 flex items-center gap-3 pl-1">
              <span className="text-[12px] text-[#b0b3b8]">
                {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <button
                onClick={() => reply.liked ? unlike(reply.id, comment.id) : like(reply.id, comment.id)}
                className={cn(
                  "text-[12px] font-semibold transition-colors hover:text-[#e4e6eb]",
                  reply.liked ? "text-[#2d88ff]" : "text-[#b0b3b8]"
                )}
              >
                Thích
              </button>
              {reply.likeCount > 0 && (
                <div className="ml-auto flex items-center gap-1 text-[12px] text-[#b0b3b8]">
                  <span>👍</span>
                  <span>{reply.likeCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="pl-9 text-left text-[12px] font-semibold text-[#b0b3b8] hover:text-[#e4e6eb]"
        >
          {loading ? "Đang tải..." : "Xem thêm phản hồi"}
        </button>
      )}

      {userId && (
        <div className="flex items-center gap-2 pt-1">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-[#3a3b3c] px-3 py-1.5">
            <Input
              placeholder="Viết phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSendReply(); }}
              className="flex-1 border-none bg-transparent p-0 text-[13px] text-[#e4e6eb] shadow-none placeholder:text-[#b0b3b8] focus-visible:ring-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommentItem({ comment, postId, onReply }: CommentItemProps) {
  const { userId } = useSelector((r: RootState) => r.user);
  const { like, unlike } = useLikeComment(postId);
  const { remove } = useDeleteComment(postId);
  const { edit } = useEditComment(postId);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  useEffect(() => { setEditText(comment.content); }, [comment.content]);

  const handleLike = () => {
    comment.liked
      ? unlike(comment.id, comment.parentId)
      : like(comment.id, comment.parentId);
  };

  const handleEdit = async () => {
    if (editText.trim() === comment.content) { setIsEditing(false); return; }
    const result = await edit(comment.id, editText);
    if (result) setIsEditing(false);
  };

  const isOwner = userId === comment.author.id;

  return (
    <div className="flex gap-2">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={comment.author.avatar ?? ""} />
        <AvatarFallback className="text-xs font-bold">{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col">
        <div className="group relative inline-block max-w-full rounded-2xl bg-[#3a3b3c] px-3 py-2">
          <p className="text-[13px] font-semibold text-[#e4e6eb]">{comment.author.name}</p>

          {isEditing ? (
            <div className="flex items-center gap-2 pt-1">
              <Input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit();
                  if (e.key === "Escape") { setIsEditing(false); setEditText(comment.content); }
                }}
                className="border-none bg-transparent p-0 text-[13.5px] text-[#e4e6eb] shadow-none focus-visible:ring-0"
              />
              <button onClick={handleEdit} className="text-[12px] font-semibold text-[#2d88ff] hover:underline">Lưu</button>
              <button onClick={() => { setIsEditing(false); setEditText(comment.content); }} className="text-[12px] font-semibold text-[#b0b3b8] hover:underline">Huỷ</button>
            </div>
          ) : (
            <p className="text-[13.5px] leading-snug text-[#e4e6eb]">{comment.content}</p>
          )}

          {isOwner && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="absolute -right-8 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full text-[#b0b3b8] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#4a4b4c]">
                    <MoreHorizontal className="size-4" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="border-[#4a4b4c] bg-[#3a3b3c]">
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="text-[#e4e6eb] focus:bg-[#4a4b4c] focus:text-[#e4e6eb]"
                >
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => remove(comment.id, comment.parentId)}
                  className="text-red-400 focus:bg-[#4a4b4c] focus:text-red-400"
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3 pl-1">
          <span className="text-[12px] text-[#b0b3b8]">
            {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
          </span>
          <button
            onClick={handleLike}
            className={cn(
              "text-[12px] font-semibold transition-colors hover:text-[#e4e6eb]",
              comment.liked ? "text-[#2d88ff]" : "text-[#b0b3b8]"
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
              className="text-[12px] font-semibold text-[#b0b3b8] transition-colors hover:text-[#e4e6eb]"
            >
              Trả lời
            </button>
          )}
          {comment.likeCount > 0 && (
            <div className="ml-auto flex items-center gap-1 text-[12px] text-[#b0b3b8]">
              <ThumbsUp className="size-3 fill-[#2d88ff] text-[#2d88ff]" />
              <span>{comment.likeCount}</span>
            </div>
          )}
        </div>

        {comment.parentId === null && (comment.replyCount > 0 || showReplies) && (
          <div className="mt-1">
            {showReplies ? (
              <ReplyList comment={comment} postId={postId} />
            ) : (
              <button
                onClick={() => setShowReplies(true)}
                className="flex items-center gap-2 text-[12px] font-semibold text-[#b0b3b8] transition-colors hover:text-[#e4e6eb]"
              >
                <span className="h-px w-6 bg-[#b0b3b8]" />
                Xem tất cả {comment.replyCount} phản hồi
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
