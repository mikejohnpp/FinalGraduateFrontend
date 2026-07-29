import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { subscribeMessageNotifications } from "@/websocket/chatSocket";
import chatSlice, { type MessageNotification } from "@/stores/chatSlice";
import type { RootState } from "@/stores/store";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { showBrowserNotification } from "@/utils/browserNotification";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";

// Nội dung xem trước: media/cuộc gọi không hiện URL thô.
function previewContent(notification: MessageNotification): string {
  switch (notification.messageType) {
    case "IMAGE":
      return "Đã gửi một ảnh";
    case "FILE":
      return "Đã gửi một tệp";
    case "VIDEO_CALL":
    case "AUDIO_CALL":
      return notification.content || "Cuộc gọi";
    default:
      return notification.content || "";
  }
}


export function useMessageNotification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connected = useSelector((state: RootState) => state.socket.connected);
  const conversationId = useSelector((state: RootState) => state.chat.conversationId);
  // Cờ bật/tắt của app + quyền trình duyệt gộp lại thành isOn.
  const { isOn } = useNotificationPermission();

  // Đọc trong callback STOMP nên dùng ref để không bắt giá trị cũ.
  const openConversationIdRef = useRef<number | null>(null);
  // Người dùng có thể bật/tắt giữa chừng → đọc qua ref để callback luôn thấy giá trị mới.
  const isOnRef = useRef<boolean>(isOn);
  // Chống hiện trùng khi cùng messageId đến hai lần (reconnect...).
  const lastMessageIdRef = useRef<number | null>(null);

  useEffect(() => {
    openConversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    isOnRef.current = isOn;
  }, [isOn]);

  useEffect(() => {
    if (!connected) return;

    const subscription = subscribeMessageNotifications((notification) => {
      if (notification.messageId === lastMessageIdRef.current) return;
      lastMessageIdRef.current = notification.messageId;

      // Người dùng đã tắt thông báo hoặc chưa cấp quyền.
      if (!isOnRef.current) return;

      // Đang mở đúng hội thoại đó thì tin nhắn đã hiện trong khung chat.
      if (openConversationIdRef.current === notification.conversationId) return;

      const title = notification.isGroup
        ? notification.conversationName || "Nhóm chat"
        : notification.sender?.username || "Tin nhắn mới";
      const body = notification.isGroup
        ? `${notification.sender?.username ?? ""}: ${previewContent(notification)}`
        : previewContent(notification);

      showBrowserNotification({
        title,
        body,
        // Avatar người gửi làm icon; fallback logo app.
        icon: resolveUploadUrl(notification.sender?.avatarUrl) ?? "/logo.svg",
        // Cùng hội thoại thì thay thế thông báo cũ thay vì xếp chồng.
        tag: `conversation-${notification.conversationId}`,
        onClick: (browserNotification) => {
          window.focus();
          browserNotification.close();
          dispatch(chatSlice.actions.setConversationId(notification.conversationId));
          navigate(`/${PATH_CONSTRAINT.MESSENGER}`);
        },
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [connected, dispatch, navigate]);
}
