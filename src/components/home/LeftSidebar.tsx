import { Users, UsersRound, Video, Bookmark, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { shortcuts } from "@/data/mock/home";
import { resolveUploadUrl } from "@/utils/uploadHelper";

const iconMap: Record<string, React.ElementType> = {
  Users,
  UsersRound,
  Video,
  Bookmark,
  Calendar,
  Clock,
};

// Mỗi lối tắt có một tông màu thương hiệu riêng để menu bớt đơn điệu
const iconColorMap: Record<string, string> = {
  Users: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  UsersRound: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  Video: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  Bookmark: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  Calendar: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  Clock: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
};


export default function LeftSidebar() {
  const navigate = useNavigate();
  const { userId, username, profile } = useSelector((r: RootState) => r.user);
  const displayName = profile?.nickName || profile?.userName || username || "Người dùng";
  const avatarSrc = resolveUploadUrl(profile?.avatar) ?? undefined;

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col gap-2 overflow-y-auto py-4 pr-2 pl-4 xl:flex">
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <Avatar size="lg">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="truncate">{displayName}</span>
      </button>

      <Separator className="my-1" />

      <div className="flex flex-col gap-1">
        <span className="px-3 text-xs font-semibold text-muted-foreground">Lối tắt</span>
        {shortcuts.map((s) => {
          const Icon = iconMap[s.icon];
          const colorClass =
            iconColorMap[s.icon] ?? "bg-muted text-muted-foreground";
          return (
            <button
              key={s.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => s.to && navigate(s.to)}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-lg ${colorClass}`}
              >
                {Icon && <Icon className="size-4" />}
              </span>
              <span className="truncate">{s.label}</span>
            </button>
          );
        })}

      </div>
    </aside>
  );
}
