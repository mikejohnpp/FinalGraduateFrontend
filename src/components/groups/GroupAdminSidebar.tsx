import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { mockGroup, mockGroupStats } from "@/data/mock/groupAdminMock";
import { 
  Home, 
  BarChart2, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Lock 
} from "lucide-react";
import { useState } from "react";

export default function GroupAdminSidebar({ groupId }: { groupId: string | number }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-72 border-r bg-background flex flex-col h-full sticky top-0 overflow-y-auto hidden md:flex">
      {/* Group Header */}
      <div className="px-3 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 rounded-lg">
            <AvatarImage src={mockGroup.avatarUrl} alt={mockGroup.name} />
            <AvatarFallback className="rounded-lg">{mockGroup.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold truncate">{mockGroup.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {mockGroup.privacy === "PRIVATE" ? <Lock className="size-3" /> : null}
              <span>Nhóm {mockGroup.privacy === "PRIVATE" ? "Riêng tư" : "Công khai"} · {mockGroup.memberCount} thành viên</span>
            </p>
          </div>
        </div>
      </div>

      {/* Nav section */}
      <div className="flex-1 p-3 space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-2">
            Quản lý
          </p>
          <div className="flex flex-col gap-1">
            <NavLink
              to={`/groups/${groupId}/admin/community`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground hover:bg-accent/50"
                )
              }
            >
              <Home className="size-4 text-muted-foreground" />
              <span>Trang chủ của cộng đồng</span>
            </NavLink>
            <NavLink
              to={`/groups/${groupId}/admin/overview`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground hover:bg-accent/50"
                )
              }
            >
              <BarChart2 className="size-4 text-muted-foreground" />
              <span>Tổng quan</span>
            </NavLink>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger render={
            <div className="flex justify-between items-center px-3 mb-2 cursor-pointer group">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide group-hover:text-foreground transition-colors">
                Công cụ quản trị
              </p>
              {isOpen ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </div>
          } />
          <CollapsibleContent className="flex flex-col gap-1">
            <NavLink
              to={`/groups/${groupId}/admin/member-requests`}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground hover:bg-accent/50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span>Yêu cầu làm thành viên</span>
              </div>
            </NavLink>

            <NavLink
              to={`/groups/${groupId}/admin/pending-posts`}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-foreground hover:bg-accent/50"
                )
              }
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span>Bài viết đang chờ</span>
              </div>
            </NavLink>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
