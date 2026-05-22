import type { Group } from "@/types/Group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GroupMineGridProps {
  groups: Group[];
}

export default function GroupMineGrid({ groups }: GroupMineGridProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between bg-background py-2">
        <h2 className="text-xl font-bold">Tất cả các nhóm bạn đã tham gia ({groups.length})</h2>
        <Button variant="outline" size="sm" className="bg-secondary/50">
          <ArrowUpDown data-icon="inline-start" /> Sắp xếp
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="flex items-center gap-3 p-3">
            <img 
              src={group.coverPhoto} 
              alt={group.name} 
              className="size-[72px] shrink-0 rounded-lg object-cover" 
            />
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold">{group.name}</p>
              {group.lastAccessed && (
                <p className="mb-2 truncate text-sm text-muted-foreground">Truy cập {group.lastAccessed}</p>
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
                      <Button variant="secondary" size="icon" className="size-8 shrink-0 rounded-lg bg-muted/50 text-muted-foreground">
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
    </div>
  );
}
