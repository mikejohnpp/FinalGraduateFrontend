import type { IGroup } from "@/types/interfaces/group/IGroup";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Lock, Search, MoreHorizontal, UserCheck, Share2 } from "lucide-react";

interface GroupDetailHeaderProps {
  group: IGroup;
  onJoin: () => void;
  onLeave: () => void;
}

export default function GroupDetailHeader({ group, onJoin, onLeave }: GroupDetailHeaderProps) {
  return (
    <div className="bg-background shadow-sm">
      {/* Cover */}
      <div className="mx-auto max-w-[1096px]">
        {/* Group Info */}
        <div className="flex flex-col justify-between gap-4 px-4 py-4 md:flex-row md:items-end md:px-8">
          <div>
            <h1 className="mb-1 text-3xl font-bold">{group.name}</h1>
            <div className="mb-4 flex items-center gap-1.5 text-muted-foreground">
              {group.privacy === "public" ? (
                <Globe data-icon="inline" />
              ) : (
                <Lock data-icon="inline" />
              )}
              <span className="font-medium">
                Nhóm {group.privacy === "public" ? "Công khai" : "Riêng tư"}
              </span>
              <span>·</span>
              <span className="font-medium">
                {group.memberCount.toLocaleString("vi-VN")} thành viên
              </span>
            </div>
          </div>

          <div className="mb-2 flex shrink-0 gap-2">
            {group.isJoined ? (
              <Button variant="secondary" className="gap-2" size="sm" onClick={onLeave}>
                <UserCheck data-icon="inline-start" /> Đã tham gia
              </Button>
            ) : (
              <Button variant="default" className="gap-2" size="sm" onClick={onJoin}>
                Tham gia nhóm
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="secondary" size="sm">
                    <MoreHorizontal data-icon="inline" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                {group.isJoined && (
                  <DropdownMenuItem className="text-destructive" onClick={onLeave}>
                    Rời khỏi nhóm
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator className="mx-4 md:mx-8" />

        {/* Sticky Tabs */}
        <div className="flex items-center justify-between px-4 md:px-8">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="flex h-14 justify-start gap-2 bg-transparent p-0">
              <TabsTrigger
                value="about"
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Giới thiệu
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Thành viên
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
