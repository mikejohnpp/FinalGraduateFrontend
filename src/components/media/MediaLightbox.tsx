import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import type { IPost } from "@/types/interfaces/post/IPost";
import type { MediaItem } from "@/types/interfaces/media/IMedia";
import PostCommentPanel from "@/components/home/PostCommentPanel";

interface MediaLightboxProps {
  post: IPost;
  /** Danh sách media để xem (thường là ảnh/video của bài viết). */
  media: MediaItem[];
  /** Chỉ số media đang mở. */
  startIndex?: number;
  open: boolean;
  onClose: () => void;
  /** Bình luận cần cuộn tới & highlight (khi mở từ thông báo). */
  highlightCommentId?: number;
}

/** Render 1 media item ở khu vực xem chính (cột trái). */
function LightboxMedia({ item }: { item: MediaItem }) {
  if (item.mediaType === "VIDEO") {
    return (
      <video src={item.url} controls autoPlay className="max-h-full max-w-full object-contain" />
    );
  }
  // IMAGE (và fallback cho các loại khác vẫn hiển thị như ảnh nếu lỡ truyền vào)
  return <img src={item.url} alt="" className="max-h-full max-w-full object-contain" />;
}

/**
 * Lightbox xem ảnh/video kiểu Facebook:
 * - Cột trái (nền đen): media đang xem + nút điều hướng trái/phải nếu có nhiều item.
 * - Cột phải: nội dung bài viết + danh sách bình luận + ô nhập (tái sử dụng PostCommentPanel).
 *
 * Hỗ trợ phím ← → để chuyển media và Esc để đóng (Esc do Dialog xử lý sẵn).
 */
export default function MediaLightbox({
  post,
  media,
  startIndex = 0,
  open,
  onClose,
  highlightCommentId,
}: MediaLightboxProps) {
  // Chỉ lấy ảnh & video để xem trong lightbox; audio/file không phù hợp khu vực xem.
  const viewable = media.filter((m) => m.mediaType === "IMAGE" || m.mediaType === "VIDEO");
  const clampedStart = Math.min(startIndex, Math.max(viewable.length - 1, 0));
  const [index, setIndex] = useState(clampedStart);

  // Reset về ảnh được click mỗi lần mở lại / đổi ảnh bắt đầu (adjust khi render, không dùng effect).
  const [prevKey, setPrevKey] = useState(`${open}-${startIndex}`);
  const currentKey = `${open}-${startIndex}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    if (open) setIndex(clampedStart);
  }

  const hasMultiple = viewable.length > 1;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + viewable.length) % viewable.length);
  }, [viewable.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % viewable.length);
  }, [viewable.length]);

  useEffect(() => {
    if (!open || !hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hasMultiple, goPrev, goNext]);

  const current = viewable[index];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 supports-backdrop-filter:backdrop-blur-none" />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className="fixed inset-0 z-50 flex flex-col outline-none md:flex-row"
        >
          <DialogTitle className="sr-only">Xem ảnh bài viết của {post.author?.name}</DialogTitle>

          {/* ── Cột trái: media viewer ── */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            >
              <X className="size-5" />
            </button>

            {current ? (
              <div className="flex size-full items-center justify-center p-4 md:p-8">
                <LightboxMedia item={current} />
              </div>
            ) : (
              <div className="text-sm text-white/60">Không có ảnh để hiển thị</div>
            )}

            {/* Điều hướng */}
            {hasMultiple && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                >
                  <ChevronRight className="size-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[13px] font-medium text-white">
                  {index + 1} / {viewable.length}
                </div>
              </>
            )}
          </div>

          {/* ── Cột phải: bài viết + bình luận ── */}
          <div
            className={cn(
              "flex w-full shrink-0 flex-col border-t border-border bg-card md:h-full md:w-[380px] md:border-t-0 md:border-l lg:w-[440px]",
              "max-h-[45vh] md:max-h-none",
            )}
          >
            <div className="flex shrink-0 items-center border-b border-border px-4 py-3">
              <span className="text-[16px] font-bold text-foreground">
                Bài viết của {post.author?.name || "Người dùng"}
              </span>
            </div>
            <PostCommentPanel post={post} highlightCommentId={highlightCommentId} />
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
