import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { API } from "@/common/constants";
import notificationService from "@/services/notificationService";
import { notificationActions } from "@/stores/notificationSlice";
import type { AppDispatch, RootState } from "@/stores/store";
import type { INotification } from "@/types/interfaces/notification/INotification";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";

// ---------------------------------------------------------------------------
// useNotifications — Infinite scroll danh sách thông báo (all / unreadOnly)
// ---------------------------------------------------------------------------
export function useNotifications(unreadOnly: boolean = false) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, hasMore, nextCursor } = useSelector((s: RootState) => s.notification);
  const { userId } = useSelector((s: RootState) => s.user);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const result = await notificationService.getSingle<CursorPageResponse<INotification>>(
          API.NOTIFICATION.BASE,
          undefined,
          {
            userId,
            unreadOnly,
            ...(cursor ? { cursor } : {}),
            size: 15,
          },
        );
        if (result) {
          if (cursor) {
            dispatch(notificationActions.appendNotifications(result));
          } else {
            dispatch(notificationActions.setNotifications(result));
          }
        }
      } catch (e) {
        console.error("Lỗi khi tải thông báo:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId, unreadOnly],
  );

  useEffect(() => {
    // Reset về trang đầu khi đổi tab all/unreadOnly
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly, userId]);

  const loadMore = useCallback(() => {
    if (hasMore && nextCursor) {
      load(nextCursor);
    }
  }, [load, hasMore, nextCursor]);

  return { notifications: items, hasMore, loadMore, loading, reload: load };
}

// ---------------------------------------------------------------------------
// useUnreadCount — Badge số thông báo chưa đọc
// ---------------------------------------------------------------------------
export function useUnreadCount() {
  const dispatch = useDispatch<AppDispatch>();
  const { unreadCount } = useSelector((s: RootState) => s.notification);
  const { userId } = useSelector((s: RootState) => s.user);

  const refresh = useCallback(() => {
    if (!userId) return;
    notificationService
      .getSingle<number>(API.NOTIFICATION.UNREAD_COUNT, undefined, { userId })
      .then((count) => {
        if (count !== null) {
          dispatch(notificationActions.setUnreadCount(count));
        }
      })
      .catch((e) => console.error("Lỗi khi lấy số thông báo chưa đọc:", e));
  }, [dispatch, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { unreadCount, refresh };
}

// ---------------------------------------------------------------------------
// useMarkAsRead — Đánh dấu 1 thông báo đã đọc (optimistic)
// ---------------------------------------------------------------------------
export function useMarkAsRead() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((s: RootState) => s.user);

  const markAsRead = useCallback(
    async (id: number) => {
      if (!userId) return;
      dispatch(notificationActions.markRead(id));
      try {
        await notificationService.markAsRead(id, userId);
      } catch (e) {
        console.error("Lỗi khi đánh dấu đã đọc:", e);
      }
    },
    [dispatch, userId],
  );

  return { markAsRead };
}

// ---------------------------------------------------------------------------
// useMarkAllAsRead — Đánh dấu tất cả đã đọc (optimistic)
// ---------------------------------------------------------------------------
export function useMarkAllAsRead() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((s: RootState) => s.user);

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    dispatch(notificationActions.markAllRead());
    try {
      await notificationService.markAllAsRead(userId);
    } catch (e) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", e);
    }
  }, [dispatch, userId]);

  return { markAllAsRead };
}
