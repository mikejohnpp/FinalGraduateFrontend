import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Search, LayoutList, Compass, Users, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGroupsData } from "@/hooks/useGroup";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import { cn } from "@/lib/utils";

export default function GroupsSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { joinedGroups } = useGroupsData();

  const managedGroups = joinedGroups.filter((g) => g.role === "ADMIN" || g.role === "MODERATOR");
  const otherJoinedGroups = joinedGroups.filter((g) => g.role !== "ADMIN" && g.role !== "MODERATOR");

  const navItems = [
    { name: "Bảng feed của bạn", path: PATH_CONSTRAINT.GROUPS, icon: LayoutList },
    { name: "Khám phá", path: PATH_CONSTRAINT.GROUPS_DISCOVER, icon: Compass },
    { name: "Nhóm của bạn", path: PATH_CONSTRAINT.GROUPS_MINE, icon: Users },
  ];

  return (
    <aside className="hidden w-70 shrink-0 flex-col border-r bg-background md:flex">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-3 p-3 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Nhóm</h2>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full bg-muted hover:bg-muted/80"
            >
              <Settings data-icon="inline" />
            </Button>
          </div>

          <div className="relative">
            <Search
              data-icon="inline"
              className="absolute top-2.5 left-2.5 text-muted-foreground"
            />
            <Input
              placeholder="Tìm kiếm nhóm"
              className="rounded-full border-transparent bg-muted pl-9 focus-visible:bg-background"
            />
          </div>

          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === PATH_CONSTRAINT.GROUPS && location.pathname === "/groups");
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "h-11 w-full justify-start gap-3 rounded-lg font-medium",
                    isActive ? "bg-muted/80" : "hover:bg-muted/50",
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full p-1.5",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                  >
                    <Icon data-icon="inline" />
                  </div>
                  <span>{item.name}</span>
                </Button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            className="h-10 w-full gap-2 font-semibold"
            onClick={() => navigate(PATH_CONSTRAINT.GROUPS_CREATE)}
          >
            <Plus data-icon="inline-start" /> Tạo nhóm mới
          </Button>

          <Separator className="my-2" />

          {managedGroups.length > 0 && (
            <>
              <div className="flex flex-col gap-2">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Nhóm do bạn quản lý</h3>
                </div>

                <div className="mt-1 flex flex-col gap-1">
                  {managedGroups.slice(0, 8).map((group) => (
                    <Button
                      key={group.id}
                      variant="ghost"
                      className="h-auto w-full justify-start gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                      onClick={() => navigate(`/groups/${group.id}/admin/overview`)}
                    >
                      <Avatar className="size-10 rounded-lg">
                        <AvatarImage src={resolveUploadUrl(group.coverPhoto) || ""} className="object-cover" />
                        <AvatarFallback className="rounded-lg">{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate font-semibold">{group.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {group.role === "ADMIN" ? "Quản trị viên" : "Người kiểm duyệt"}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
            </>
          )}

          <div className="flex flex-col gap-2">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nhóm bạn đã tham gia</h3>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 font-normal"
                onClick={() => navigate(PATH_CONSTRAINT.GROUPS_MINE)}
              >
                Xem tất cả
              </Button>
            </div>

            <div className="mt-1 flex flex-col gap-1">
              {otherJoinedGroups.slice(0, 8).map((group) => (
                <Button
                  key={group.id}
                  variant="ghost"
                  className="h-auto w-full justify-start gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  <Avatar className="size-10 rounded-lg">
                    <AvatarImage src={resolveUploadUrl(group.coverPhoto) || ""} className="object-cover" />
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
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
