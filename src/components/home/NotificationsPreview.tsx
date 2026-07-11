import { useState } from "react";
import { Bell } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotification";
import { useNotificationClick } from "@/hooks/useNotificationClick";
import {
  TYPE_META,
  FALLBACK_META,
  defaultMessage,
  timeAgo,
} from "@/common/notificationHelpers";
import type { INotification } from "@/types/interfaces/notification/INotification";
import NotificationsInnerPopover from "@/components/NotificationsInnerPopover";

/** Hàng thông báo gọn (avatar + nội dung 1 dòng + thời gian) cho khối preview. */
function PreviewRow({
  notification,
  onClick,
}: {
  notification: INotification;
  onClick: (n: INotification) => void;
}) {
  const meta = TYPE_META[notification.type] ?? FALLBACK_META;
  const Icon = meta.icon;
  const actorName = notification.actor?.nickName || notification.actor?.name || "?";
  const initial = actorName.charAt(0).toUpperCase();
  const text = notification.message?.trim() || defaultMessage(notification);

  return (
    <button
      onClick={() => onClick(notification)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left",
        "transition-colors hover:bg-accent focus-visible:outline-none",
        !notification.isRead && "bg-primary/5",
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="size-8">
          <AvatarImage src={notification.actor?.avatar || undefined} />
          <AvatarFallback className="text-xs font-semibold">{initial}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full ring-2 ring-background",
            meta.badge,
          )}
        >
          <Icon className="size-2.5 text-white" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "line-clamp-1 text-xs text-foreground",
            !notification.isRead && "font-medium",
          )}
        >
          {text}
        </p>
        <span
          className={cn(
            "text-[11px]",
            notification.isRead ? "text-muted-foreground" : "font-medium text-primary",
          )}
        >
          {timeAgo(notification.createdAt)}
        </span>
      </div>

      {!notification.isRead && (
        <span className="size-2 flex-shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

/**
 * Khối "Thông báo mới nhất" ở đầu thanh phải.
 *
 * - Hiển thị tối đa 4 thông báo mới nhất.
 * - Bấm vào bất kỳ dòng nào (hoặc tiêu đề) sẽ mở popover thông báo đầy đủ.
 * - Dùng chung hook xử lý click (mở post viewer / điều hướng) với chuông trên header.
 */
export default function NotificationsPreview() {
  const { notifications, loading } = useNotifications(false);
  const onNotificationClick = useNotificationClick();
  const [open, setOpen] = useState(false);

  const latest = notifications.slice(0, 4);

  const handleRowClick = (n: INotification) => onNotificationClick(n);

  return (
    <div className="flex flex-col gap-1 px-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Mở tất cả thông báo"
            >
              <Bell className="size-3.5" />
              Thông báo
            </button>
          }
        />
        <PopoverContent align="start" sideOffset={8} className="w-[400px] rounded-xl p-0 shadow-lg">
          <NotificationsInnerPopover onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>

      {loading && notifications.length === 0 ? (
        <div className="px-2 py-3 text-center text-[11px] text-muted-foreground">Đang tải...</div>
      ) : latest.length === 0 ? (
        <p className="px-2 py-3 text-center text-[11px] text-muted-foreground">
          Chưa có thông báo nào
        </p>
      ) : (
        latest.map((n) => <PreviewRow key={n.id} notification={n} onClick={handleRowClick} />)
      )}
    </div>
  );
}
