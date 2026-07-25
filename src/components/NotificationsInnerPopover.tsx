import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkAllAsRead,
} from "@/hooks/useNotification";
import { useNotificationClick } from "@/hooks/useNotificationClick";
import {
  TYPE_META,
  FALLBACK_META,
  defaultMessage,
  timeAgo,
} from "@/common/notificationHelpers";
import type { INotification } from "@/types/interfaces/notification/INotification";

// Phân nhóm "Mới" (<= 24h) và "Trước đó"
function isRecent(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() <= 24 * 60 * 60 * 1000;
}

interface NotificationItemProps {
  notification: INotification;
  onClick: (n: INotification) => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const meta = TYPE_META[notification.type] ?? FALLBACK_META;
  const Icon = meta.icon;
  const actorName = notification.actor?.name || notification.actor?.nickName || "?";
  const initial = actorName.charAt(0).toUpperCase();
  const text = notification.message?.trim() || defaultMessage(notification);

  return (
    <button
      onClick={() => onClick(notification)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
        "transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        !notification.isRead && "bg-primary/5",
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={notification.actor?.avatar || undefined} />
          <AvatarFallback className="text-sm font-semibold">{initial}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-background",
            meta.badge,
          )}
        >
          <Icon className="h-3.5 w-3.5 text-white" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "line-clamp-2 text-sm text-foreground",
            !notification.isRead && "font-medium",
          )}
        >
          {text}
        </p>
        <span
          className={cn(
            "text-xs",
            notification.isRead ? "text-muted-foreground" : "font-medium text-primary",
          )}
        >
          {timeAgo(notification.createdAt)}
        </span>
      </div>

      {!notification.isRead && (
        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}

interface NotificationsInnerPopoverProps {
  onClose?: () => void;
}

export function NotificationsInnerPopover({ onClose }: NotificationsInnerPopoverProps) {
  const [tab, setTab] = React.useState<"all" | "unread">("all");

  const unreadOnly = tab === "unread";

  const { notifications, hasMore, loadMore, loading } = useNotifications(unreadOnly);
  const { markAllAsRead } = useMarkAllAsRead();
  const onNotificationClick = useNotificationClick();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80 && hasMore && !loading) {
      loadMore();
    }
  };

  const handleClick = (n: INotification) => onNotificationClick(n, onClose);

  const recent = notifications.filter((n) => isRecent(n.createdAt));
  const earlier = notifications.filter((n) => !isRecent(n.createdAt));

  return (
    <div>
      <div className="px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Thông báo</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs font-medium"
            onClick={() => markAllAsRead()}
          >
            <CheckCheck className="h-4 w-4" />
            Đánh dấu đã đọc
          </Button>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")} className="mb-1">
          <TabsList className="h-8 w-auto gap-0.5 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="h-7 rounded-full px-4 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="h-7 rounded-full px-4 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              Chưa đọc
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator />

      <ScrollArea className="h-[420px]" onScrollCapture={handleScroll}>
        <div className="p-2">
          {notifications.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="mb-2 h-9 w-9 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {unreadOnly ? "Không có thông báo chưa đọc" : "Chưa có thông báo nào"}
              </p>
            </div>
          ) : (
            <>
              {recent.length > 0 && (
                <>
                  <p className="px-3 pt-2 pb-1 text-sm font-semibold text-foreground">Mới</p>
                  {recent.map((n) => (
                    <NotificationItem key={n.id} notification={n} onClick={handleClick} />
                  ))}
                </>
              )}

              {earlier.length > 0 && (
                <>
                  <p className="px-3 pt-3 pb-1 text-sm font-semibold text-foreground">Trước đó</p>
                  {earlier.map((n) => (
                    <NotificationItem key={n.id} notification={n} onClick={handleClick} />
                  ))}
                </>
              )}

              {loading && (
                <p className="py-4 text-center text-xs text-muted-foreground">Đang tải...</p>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default NotificationsInnerPopover;
