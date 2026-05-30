import { API } from "@/common/constants";
import postService from "@/services/postService";
import type { AppDispatch, RootState } from "@/stores/store";
import { postActions } from "@/stores/postSlice";
import type { IPost } from "@/types/interfaces/post/IPost";
import type { IPostDetails } from "@/types/interfaces/post/IPostDetails";
import type { IPostCreate, IPostUpdate } from "@/types/interfaces/post/IPostCreate";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useSuggestedFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestedFeed } = useSelector((r: RootState) => r.post);
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const result = await postService.getSingle<CursorPageResponse<IPost>>(
          API.POST.SUGGESTED,
          undefined,
          { userId, ...(cursor ? { cursor } : {}), size: 10 },
        );
        if (result) {
          cursor
            ? dispatch(postActions.appendSuggestedPosts(result))
            : dispatch(postActions.setSuggestedFeed(result));
        }
      } catch (e) {
        console.error("Lỗi khi tải bài viết:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    if (suggestedFeed.hasMore && suggestedFeed.nextCursor) {
      load(suggestedFeed.nextCursor);
    }
  }, [load, suggestedFeed.hasMore, suggestedFeed.nextCursor]);

  return {
    posts: suggestedFeed.items,
    hasMore: suggestedFeed.hasMore,
    loadMore,
    loading,
  };
}

export function useCreatePost() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: IPostCreate): Promise<IPostDetails | null> => {
    setError(null);
    if (!data.content.trim()) {
      setError("Nội dung bài viết không được để trống");
      return null;
    }
    setLoading(true);
    try {
      const result = await postService.createAndGetData<IPostDetails>(API.POST.BASE, data);
      if (result) {
        const asPost: IPost = { ...result, commentCount: 0 };
        dispatch(postActions.prependPost(asPost));
      }
      return result;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Tạo bài viết thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function usePostDetail(id: number) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPost } = useSelector((r: RootState) => r.post);
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await postService.getSingle<IPostDetails>(
          API.POST.BASE,
          id,
          userId ? { userId } : undefined,
        );
        dispatch(postActions.setCurrentPost(result));
      } catch (e: any) {
        setError(e?.response?.data?.message ?? "Không tìm thấy bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetch();
    return () => {
      dispatch(postActions.setCurrentPost(null));
    };
  }, [dispatch, id]);

  return { post: currentPost, loading, error };
}

export function useUpdatePost() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: number, data: IPostUpdate): Promise<IPostDetails | null> => {
    setError(null);
    if (!data.content.trim()) {
      setError("Nội dung bài viết không được để trống");
      return null;
    }
    setLoading(true);
    try {
      const url = userId ? `${API.POST.BASE}/${id}?userId=${userId}` : `${API.POST.BASE}/${id}`;
      const result = await postService.updateAndGetData<IPostDetails>(url, data);
      if (result) {
        dispatch(postActions.setCurrentPost(result));
      }
      return result;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Cập nhật bài viết thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeletePost() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await postService.delete(API.POST.BASE, [id]);
      if (success) {
        dispatch(postActions.removePost(id));
      }
      return success;
    } catch (e) {
      console.error("Xoá bài viết thất bại:", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}

export function useLikePost() {
  const dispatch = useDispatch<AppDispatch>();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const like = async (postId: number, userId: number): Promise<boolean> => {
    setLoadingId(postId);
    dispatch(postActions.updateLikeCount({ postId, delta: 1 }));
    try {
      const success = await postService.likePost(postId, userId);
      if (!success) {
        dispatch(postActions.updateLikeCount({ postId, delta: -1 }));
      }
      return success;
    } catch (e) {
      dispatch(postActions.updateLikeCount({ postId, delta: -1 }));
      return false;
    } finally {
      setLoadingId(null);
    }
  };

  const unlike = async (postId: number, userId: number): Promise<boolean> => {
    setLoadingId(postId);
    dispatch(postActions.updateLikeCount({ postId, delta: -1 }));
    try {
      const success = await postService.unlikePost(postId, userId);
      if (!success) {
        dispatch(postActions.updateLikeCount({ postId, delta: 1 }));
      }
      return success;
    } catch (e) {
      dispatch(postActions.updateLikeCount({ postId, delta: 1 }));
      return false;
    } finally {
      setLoadingId(null);
    }
  };

  return { like, unlike, loadingId };
}
