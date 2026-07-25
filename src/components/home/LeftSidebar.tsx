import {
  Users,
  UsersRound,
  Video,
  Bookmark,
  Calendar,
  Clock,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { shortcuts } from "@/data/mock/home";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { useGroupsData } from "@/hooks/useGroup";
import { PATH_CONSTRAINT } from "@/plugins/routers";

const iconMap: Record<string, React.ElementType> = {
  Users,
  UsersRound,
  Video,
  Bookmark,
  Calendar,
  Clock,
};

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
  const displayName = profile?.userName || profile?.nickName || username || "Người dùng";
  const avatarSrc = resolveUploadUrl(profile?.avatar) ?? undefined;

  const { joinedGroups } = useGroupsData();
  const managedGroups = joinedGroups.filter((g) => g.role === "ADMIN" || g.role === "MODERATOR");
  const otherJoinedGroups = joinedGroups.filter(
    (g) => g.role !== "ADMIN" && g.role !== "MODERATOR",
  );

  return (
    <aside className="custom-scrollbar hidden w-75 shrink-0 flex-col gap-2 overflow-y-auto py-4 pr-2 pl-4 xl:flex">
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
        <span className="flex items-center gap-1.5 px-3 text-xs font-semibold text-muted-foreground">
          <LayoutGrid className="size-3.5" />
          Lối tắt
        </span>
        {shortcuts.map((s) => {
          const Icon = iconMap[s.icon];
          const colorClass = iconColorMap[s.icon] ?? "bg-muted text-muted-foreground";
          return (
            <button
              key={s.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => s.to && navigate(s.to)}
            >
              <span className={`flex size-8 items-center justify-center rounded-lg ${colorClass}`}>
                {Icon && <Icon className="size-4" />}
              </span>
              <span className="truncate">{s.label}</span>
            </button>
          );
        })}
      </div>

      {(managedGroups.length > 0 || otherJoinedGroups.length > 0) && (
        <>
          <Separator className="my-1" />

          {managedGroups.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 px-3 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                Nhóm do bạn quản lý
              </span>
              {managedGroups.slice(0, 6).map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => navigate(`/groups/${group.id}/admin/overview`)}
                >
                  <Avatar className="size-9 rounded-lg">
                    <AvatarImage
                      src={resolveUploadUrl(group.coverPhoto) || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg">{group.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate font-semibold">{group.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {group.role === "ADMIN" ? "Quản trị viên" : "Người kiểm duyệt"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {otherJoinedGroups.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Users className="size-3.5" />
                  Nhóm bạn đã tham gia
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs font-normal"
                  onClick={() => navigate(PATH_CONSTRAINT.GROUPS_MINE)}
                >
                  Xem tất cả
                </Button>
              </div>
              {otherJoinedGroups.slice(0, 6).map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  <Avatar className="size-9 rounded-lg">
                    <AvatarImage
                      src={resolveUploadUrl(group.coverPhoto) || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg">{group.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate font-semibold">{group.name}</p>
                    {group.memberCount && (
                      <p className="truncate text-xs text-muted-foreground">
                        {group.memberCount.toLocaleString("vi-VN")} thành viên
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </aside>
  );
}
