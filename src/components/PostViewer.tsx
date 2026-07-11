import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/stores/store";
import { postViewerActions } from "@/stores/postViewerSlice";
import { usePostDetail } from "@/hooks/usePost";
import type { IPost } from "@/types/interfaces/post/IPost";
import CommentModal from "@/components/home/CommentModal";
import MediaLightbox from "@/components/media/MediaLightbox";

/**
 * Trình xem bài viết toàn cục — mở overlay khi bấm vào thông báo bình luận/trả lời.
 *
 * Điều kiện hiển thị (hướng B1):
 * - Nếu bài viết có ảnh/video xem được → mở MediaLightbox (layout kiểu Facebook).
 * - Ngược lại → mở CommentModal có sẵn.
 *
 * `commentId` (nếu có) được truyền xuống để cuộn tới & highlight đúng bình luận.
 * Mount 1 lần trong MainLayout; đọc trạng thái từ Redux (postViewerSlice).
 */
export default function PostViewer() {
  const dispatch = useDispatch<AppDispatch>();
  const { postId, commentId } = useSelector((s: RootState) => s.postViewer);

  const handleClose = () => dispatch(postViewerActions.closePostViewer());

  if (postId == null) return null;

  return (
    <PostViewerInner
      postId={postId}
      commentId={commentId ?? undefined}
      onClose={handleClose}
    />
  );
}

function PostViewerInner({
  postId,
  commentId,
  onClose,
}: {
  postId: number;
  commentId?: number;
  onClose: () => void;
}) {
  const { post, loading } = usePostDetail(postId);

  // IPostDetails không có commentCount → chuẩn hoá sang IPost để tái sử dụng
  // CommentModal & MediaLightbox (vốn nhận IPost).
  const postAsIPost = useMemo<IPost | null>(
    () => (post ? ({ ...post, commentCount: 0 } as IPost) : null),
    [post],
  );

  const hasViewableMedia = useMemo(
    () =>
      post?.media?.some((m) => m.mediaType === "IMAGE" || m.mediaType === "VIDEO") ?? false,
    [post],
  );

  // Đang tải hoặc không tìm thấy → không render gì (tránh nháy overlay rỗng).
  if (loading || !postAsIPost) return null;

  return hasViewableMedia ? (
    <MediaLightbox
      post={postAsIPost}
      media={postAsIPost.media}
      startIndex={0}
      open
      onClose={onClose}
      highlightCommentId={commentId}
    />
  ) : (
    <CommentModal
      post={postAsIPost}
      open
      onClose={onClose}
      highlightCommentId={commentId}
    />
  );
}
