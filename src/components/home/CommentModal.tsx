import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { IPost } from "@/types/interfaces/post/IPost";
import PostCommentPanel from "./PostCommentPanel";

export default function CommentModal({
  post,
  open,
  onClose,
  highlightCommentId,
}: {
  post: IPost;
  open: boolean;
  onClose: () => void;
  /** Bình luận cần cuộn tới & highlight (khi mở từ thông báo). */
  highlightCommentId?: number;
}) {
  const authorName = post.author?.name || "Người dùng";

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

        <PostCommentPanel post={post} highlightCommentId={highlightCommentId} />
      </DialogContent>
    </Dialog>
  );
}
