import type { IGroup } from "@/types/interfaces/group/IGroup";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GroupMineGridProps {
  groups: IGroup[];
}

export default function GroupMineGrid({ groups }: GroupMineGridProps) {
  const navigate = useNavigate();

  const managedGroups = groups.filter((g) => g.role === "ADMIN" || g.role === "MODERATOR");
  const otherJoinedGroups = groups.filter((g) => g.role !== "ADMIN" && g.role !== "MODERATOR");

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-4 p-4 md:p-6">
      {managedGroups.length > 0 && (
        <>
          <div className="flex items-center justify-between bg-background py-2">
            <h2 className="text-xl font-bold">Nhóm do bạn quản lý ({managedGroups.length})</h2>
            <Button variant="outline" size="sm" className="bg-secondary/50">
              <ArrowUpDown data-icon="inline-start" /> Sắp xếp
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {managedGroups.map((group) => (
              <Card key={group.id} className="flex items-center gap-3 p-3">
                <img
                  src={resolveUploadUrl(group.coverPhoto) || "https://placehold.co/600x400/png"}
                  alt={group.name}
                  className="size-[72px] shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{group.name}</p>
                  <p className="mb-2 truncate text-sm text-muted-foreground">
                    {group.role === "ADMIN" ? "Quản trị viên" : "Người kiểm duyệt"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 flex-1 text-sm"
                      onClick={() => navigate(`/groups/${group.id}/admin/overview`)}
                    >
                      Quản lý
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="secondary"
                            size="icon"
                            className="size-8 shrink-0 rounded-lg bg-muted/50 text-muted-foreground"
                          >
                            <MoreHorizontal data-icon="inline" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem>Tắt thông báo</DropdownMenuItem>
                        <DropdownMenuItem>Đánh dấu là đã đọc</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Rời nhóm</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {otherJoinedGroups.length > 0 && (
        <>
          <div className="flex items-center justify-between bg-background py-2">
            <h2 className="text-xl font-bold">Tất cả các nhóm bạn đã tham gia ({otherJoinedGroups.length})</h2>
            <Button variant="outline" size="sm" className="bg-secondary/50">
              <ArrowUpDown data-icon="inline-start" /> Sắp xếp
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {otherJoinedGroups.map((group) => (
              <Card key={group.id} className="flex items-center gap-3 p-3">
                <img
                  src={resolveUploadUrl(group.coverPhoto) || "https://placehold.co/600x400/png"}
                  alt={group.name}
                  className="size-[72px] shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{group.name}</p>
                  {group.memberCount && (
                    <p className="mb-2 truncate text-sm text-muted-foreground">
                      {group.memberCount.toLocaleString("vi-VN")} thành viên
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 flex-1 text-sm"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      Xem nhóm
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="secondary"
                            size="icon"
                            className="size-8 shrink-0 rounded-lg bg-muted/50 text-muted-foreground"
                          >
                            <MoreHorizontal data-icon="inline" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem>Tắt thông báo</DropdownMenuItem>
                        <DropdownMenuItem>Đánh dấu là đã đọc</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Rời nhóm</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
