import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { postViewerActions } from "@/stores/postViewerSlice";
import type { AppDispatch } from "@/stores/store";
import { useMarkAsRead } from "@/hooks/useNotification";
import type { INotification } from "@/types/interfaces/notification/INotification";

/**
 * Hook dùng chung xử lý khi bấm vào 1 thông báo (popover chuông & khối preview
 * ở thanh phải). Đảm bảo hành vi giống nhau ở mọi nơi:
 *
 * - Đánh dấu đã đọc (nếu chưa đọc).
 * - COMMENT / REPLY → mở trình xem bài viết (overlay) & cuộn tới bình luận.
 *   link backend dạng "/posts/{postId}"; entityId là id bình luận cần highlight.
 * - Chuẩn hoá link không khớp route thực tế (`/friends/requests` → `/friends/request`).
 * - Còn lại → điều hướng theo link.
 *
 * `onDone` được gọi sau khi xử lý (ví dụ để đóng popover).
 */
export function useNotificationClick() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { markAsRead } = useMarkAsRead();

  return useCallback(
    (n: INotification, onDone?: () => void) => {
      if (!n.isRead) markAsRead(n.id);

      if (n.type === "COMMENT" || n.type === "REPLY") {
        const postId = n.link ? Number(n.link.replace(/^\/posts\//, "")) : NaN;
        if (!Number.isNaN(postId)) {
          dispatch(
            postViewerActions.openPostViewer({
              postId,
              commentId: n.entityId ?? null,
            }),
          );
          onDone?.();
          return;
        }
      }

      if (n.link) {
        const link = n.link === "/friends/requests" ? "/friends/request" : n.link;
        navigate(link);
      }
      onDone?.();
    },
    [navigate, dispatch, markAsRead],
  );
}

export default useNotificationClick;
