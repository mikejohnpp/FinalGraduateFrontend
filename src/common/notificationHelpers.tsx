import {
  Bell,
  MessageCircle,
  Reply,
  UserPlus,
  UserCheck,
  Users,
  FileClock,
  FileCheck2,
} from "lucide-react";
import type * as React from "react";

import type {
  INotification,
  NotificationType,
} from "@/types/interfaces/notification/INotification";

/** Icon + màu nền theo loại thông báo (badge nhỏ ở góc avatar). */
export const TYPE_META: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; badge: string }
> = {
  COMMENT: { icon: MessageCircle, badge: "bg-blue-500" },
  REPLY: { icon: Reply, badge: "bg-sky-500" },
  FRIEND_REQUEST: { icon: UserPlus, badge: "bg-emerald-500" },
  FRIEND_ACCEPT: { icon: UserCheck, badge: "bg-emerald-600" },
  GROUP_JOIN_REQUEST: { icon: Users, badge: "bg-violet-500" },
  GROUP_JOIN_APPROVED: { icon: Users, badge: "bg-violet-600" },
  GROUP_POST_PENDING: { icon: FileClock, badge: "bg-amber-500" },
  GROUP_POST_APPROVED: { icon: FileCheck2, badge: "bg-green-600" },
};

/** Icon mặc định khi loại thông báo không nằm trong TYPE_META. */
export const FALLBACK_META = { icon: Bell, badge: "bg-muted-foreground" };

/** Nội dung mặc định nếu backend không gửi message sẵn. */
export function defaultMessage(n: INotification): string {
  const actor = n.actor?.name || n.actor?.nickName || "Ai đó";
  switch (n.type) {
    case "COMMENT":
      return `${actor} đã bình luận về bài viết của bạn`;
    case "REPLY":
      return `${actor} đã trả lời bình luận của bạn`;
    case "FRIEND_REQUEST":
      return `${actor} đã gửi cho bạn lời mời kết bạn`;
    case "FRIEND_ACCEPT":
      return `${actor} đã chấp nhận lời mời kết bạn`;
    case "GROUP_JOIN_REQUEST":
      return `${actor} muốn tham gia nhóm của bạn`;
    case "GROUP_JOIN_APPROVED":
      return `Yêu cầu tham gia nhóm của bạn đã được duyệt`;
    case "GROUP_POST_PENDING":
      return `${actor} có bài viết chờ bạn duyệt`;
    case "GROUP_POST_APPROVED":
      return `Bài viết của bạn trong nhóm đã được duyệt`;
    default:
      return "Bạn có một thông báo mới";
  }
}

/** Định dạng thời gian tương đối kiểu Facebook. */
export function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return "Vừa xong";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} phút`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} tuần`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng`;
  return `${Math.floor(days / 365)} năm`;
}
