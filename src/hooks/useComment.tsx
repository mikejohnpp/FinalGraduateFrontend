import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/stores/store";
import { commentActions } from "@/stores/commentSlice";
import commentService from "@/services/commentService";
import { API } from "@/common/constants";
import type { IComment } from "@/types/interfaces/comment/IComment";
import type { ICommentCreate, ICommentUpdate } from "@/types/interfaces/comment/ICommentCreate";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";
import { toast } from "sonner";

// URL builders — template literals từ constants, không dùng hàm trong constants
const commentUrl = (postId: number) =>
  `${API.POST.BASE}/${postId}/${API.COMMENT.PATH}`;
const commentSingleUrl = (postId: number, commentId: number) =>
  `${API.POST.BASE}/${postId}/${API.COMMENT.PATH}/${commentId}`;
const repliesUrl = (postId: number, commentId: number) =>
  `${API.POST.BASE}/${postId}/${API.COMMENT.PATH}/${commentId}/${API.COMMENT.REPLIES_PATH}`;
const likeUrl = (postId: number, commentId: number) =>
  `${API.POST.BASE}/${postId}/${API.COMMENT.PATH}/${commentId}/${API.COMMENT.LIKE_PATH}`;

// ─────────────────────────────────────────────────────────────────────────────
// useComments — Lấy danh sách comment gốc của một post (infinite scroll)
// ─────────────────────────────────────────────────────────────────────────────
export function useComments(postId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const feedState = useSelector((r: RootState) => r.comment.commentsByPost[postId]);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const comments = feedState?.items ?? [];
  const hasMore = feedState?.hasMore ?? true;
  const nextCursor = feedState?.nextCursor ?? null;

  const load = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId || !postId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const result = await commentService.getSingle<CursorPageResponse<IComment>>(
          commentUrl(postId),
          undefined,
          { userId, ...(cursor ? { cursor } : {}), size: 10 }
        );
        if (result) {
          cursor
            ? dispatch(commentActions.appendComments({ postId, data: result }))
            : dispatch(commentActions.setComments({ postId, data: result }));
        }
      } catch (e) {
        console.error("Lỗi khi tải bình luận:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId, postId]
  );

  useEffect(() => {
    if (!feedState) load();
  }, [feedState, load]);

  const loadMore = useCallback(() => {
    if (hasMore && nextCursor) load(nextCursor);
  }, [load, hasMore, nextCursor]);

  return { comments, loading, hasMore, loadMore, refetch: () => load() };
}

// ─────────────────────────────────────────────────────────────────────────────
// useReplies — Lấy replies của một comment (lazy)
// ─────────────────────────────────────────────────────────────────────────────
export function useReplies(postId: number, commentId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const feedState = useSelector((r: RootState) => r.comment.repliesByComment[commentId]);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const replies = feedState?.items ?? [];
  const hasMore = feedState?.hasMore ?? true;
  const nextCursor = feedState?.nextCursor ?? null;
  const loaded = feedState?.loaded ?? false;

  const fetch = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const result = await commentService.getSingle<CursorPageResponse<IComment>>(
          repliesUrl(postId, commentId),
          undefined,
          { userId, ...(cursor ? { cursor } : {}), size: 5 }
        );
        if (result) {
          cursor
            ? dispatch(commentActions.appendReplies({ commentId, data: result }))
            : dispatch(commentActions.setReplies({ commentId, data: result }));
        }
      } catch (e) {
        console.error("Lỗi khi tải phản hồi:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId, postId, commentId]
  );

  const load = useCallback(() => fetch(), [fetch]);
  const loadMore = useCallback(() => {
    if (hasMore && nextCursor) fetch(nextCursor);
  }, [fetch, hasMore, nextCursor]);

  return { replies, loading, hasMore, loaded, load, loadMore };
}

// ─────────────────────────────────────────────────────────────────────────────
// useCreateComment — Tạo comment mới hoặc reply
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateComment(postId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (content: string, parentId?: number | null): Promise<IComment | null> => {
      if (!content.trim()) {
        setError("Nội dung bình luận không được để trống");
        return null;
      }
      if (!userId) return null;
      setError(null);
      setLoading(true);
      try {
        const body: ICommentCreate = { userId, content: content.trim(), parentId };
        const result = await commentService.createAndGetData<IComment>(
          commentUrl(postId),
          body
        );
        if (result) {
          if (parentId) {
            dispatch(commentActions.appendReply({ commentId: parentId, reply: result, postId }));
          } else {
            dispatch(commentActions.prependComment({ postId, comment: result }));
          }
        }
        return result;
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Gửi bình luận thất bại";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, userId, postId]
  );

  return { create, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// useEditComment — Chỉnh sửa nội dung comment
// ─────────────────────────────────────────────────────────────────────────────
export function useEditComment(postId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const edit = useCallback(
    async (commentId: number, content: string): Promise<IComment | null> => {
      if (!content.trim()) {
        setError("Nội dung không được để trống");
        return null;
      }
      if (!userId) return null;
      setError(null);
      setLoading(true);
      try {
        const body: ICommentUpdate = { content: content.trim() };
        // userId là query param theo API spec — append vào URL
        const result = await commentService.updateAndGetData<IComment>(
          `${commentSingleUrl(postId, commentId)}?userId=${userId}`,
          body
        );
        if (result) dispatch(commentActions.updateComment(result));
        return result;
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Chỉnh sửa thất bại";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, userId, postId]
  );

  return { edit, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// useDeleteComment — Xóa comment (userId là query param, dùng deleteWithBody)
// ─────────────────────────────────────────────────────────────────────────────
export function useDeleteComment(postId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);

  const remove = useCallback(
    async (commentId: number, parentId: number | null): Promise<boolean> => {
      if (!userId) return false;
      setLoading(true);
      try {
        // userId là query param: append vào URL để BaseService.deleteWithBody gửi đúng
        const success = await commentService.deleteWithBody(
          `${commentSingleUrl(postId, commentId)}?userId=${userId}`,
          {}
        );
        if (success) {
          dispatch(commentActions.removeComment({ postId, commentId, parentId }));
          toast.success("Đã xóa bình luận");
        }
        return success;
      } catch (e: unknown) {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Xóa bình luận thất bại";
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, userId, postId]
  );

  return { remove, loading };
}

// ─────────────────────────────────────────────────────────────────────────────
// useLikeComment — Like / Unlike comment với optimistic update
// ─────────────────────────────────────────────────────────────────────────────
export function useLikeComment(postId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const like = useCallback(
    async (commentId: number, parentId: number | null): Promise<void> => {
      if (!userId) return;
      setLoadingId(commentId);
      dispatch(commentActions.toggleLikeComment({ postId, commentId, parentId, delta: 1 }));
      try {
        const success = await commentService.create(likeUrl(postId, commentId), { userId });
        if (!success)
          dispatch(commentActions.toggleLikeComment({ postId, commentId, parentId, delta: -1 }));
      } catch {
        dispatch(commentActions.toggleLikeComment({ postId, commentId, parentId, delta: -1 }));
      } finally {
        setLoadingId(null);
      }
    },
    [dispatch, userId, postId]
  );

  const unlike = useCallback(
    async (commentId: number, parentId: number | null): Promise<void> => {
      if (!userId) return;
      setLoadingId(commentId);
      dispatch(commentActions.toggleLikeComment({ postId, commentId, parentId, delta: -1 }));
      try {
        const success = await commentService.deleteWithBody(likeUrl(postId, commentId), { userId });
        if (!success)
          dispatch(commentActions.toggleLikeComment({ postId, commentId, parentId, delta: 1 }));
      } catch {
        dispatch(commentActions.toggleLikeComment({ postId, commentId, parentId, delta: 1 }));
      } finally {
        setLoadingId(null);
      }
    },
    [dispatch, userId, postId]
  );

  return { like, unlike, loadingId };
}
