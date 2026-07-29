import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermissionState,
} from "@/utils/browserNotification";

const PREF_KEY = "message_notification_enabled";

function readEnabledPref(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(PREF_KEY) !== "false";
}

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermissionState>(() =>
    getNotificationPermission(),
  );
  const [enabled, setEnabled] = useState<boolean>(() => readEnabledPref());

  // Người dùng có thể đổi quyền trong thanh địa chỉ mà không reload trang.
  useEffect(() => {
    if (!("permissions" in navigator)) return;

    let status: PermissionStatus | null = null;
    const onChange = () => setPermission(getNotificationPermission());

    navigator.permissions
      .query({ name: "notifications" as PermissionName })
      .then((result) => {
        status = result;
        status.addEventListener("change", onChange);
      })
      .catch(() => {
        // Một số trình duyệt không cho query 'notifications' — bỏ qua, vẫn dùng
        // giá trị đọc lúc mount.
      });

    return () => {
      status?.removeEventListener("change", onChange);
    };
  }, []);

  const persistEnabled = useCallback((value: boolean) => {
    setEnabled(value);
    localStorage.setItem(PREF_KEY, String(value));
  }, []);

  const toggle = useCallback(
    async (next: boolean): Promise<boolean> => {
      if (!next) {
        persistEnabled(false);
        toast.success("Đã tắt thông báo tin nhắn");
        return false;
      }

      const current = getNotificationPermission();
      let result = current;
      if (current === "default") {
        result = await requestNotificationPermission();
        setPermission(result);
      }

      if (result === "unsupported") {
        toast.error("Trình duyệt này không hỗ trợ thông báo trên máy tính");
        persistEnabled(false);
        return false;
      }
      if (result === "denied") {
        toast.error("Bạn đã chặn thông báo. Hãy bật lại trong cài đặt của trình duyệt.");
        persistEnabled(false);
        return false;
      }

      persistEnabled(true);
      toast.success("Đã bật thông báo tin nhắn");
      return true;
    },
    [persistEnabled],
  );

  const isSupported = permission !== "unsupported";
  const isGranted = permission === "granted";

  return {
    permission,
    enabled,
    isSupported,
    isGranted,
    isBlocked: permission === "denied",
    isOn: isGranted && enabled,
    toggle,
  };
}
