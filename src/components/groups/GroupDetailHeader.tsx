import type { Group } from "@/types/Group";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Lock, Search, MoreHorizontal, UserCheck, Share2 } from "lucide-react";

interface GroupDetailHeaderProps {
  group: Group;
}

export default function GroupDetailHeader({ group }: GroupDetailHeaderProps) {
  return (
    <div className="bg-background shadow-sm">
      {/* Cover */}
      <div className="mx-auto max-w-[1096px]">
        <div className="relative aspect-[16/5] overflow-hidden rounded-b-lg bg-muted md:aspect-[16/6]">
          {group.coverPhoto && (
            <img src={group.coverPhoto} alt={group.name} className="size-full object-cover" />
          )}
        </div>

        {/* Group Info */}
        <div className="flex flex-col justify-between gap-4 px-4 py-4 md:flex-row md:items-end md:px-8">
          <div>
            <h1 className="mb-1 text-3xl font-bold">{group.name}</h1>
            <div className="mb-4 flex items-center gap-1.5 text-muted-foreground">
              {group.privacy === 'public' ? <Globe data-icon="inline" /> : <Lock data-icon="inline" />}
              <span className="font-medium">Nhóm {group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}</span>
              <span>·</span>
              <span className="font-medium">{group.memberCount.toLocaleString("vi-VN")} thành viên</span>
            </div>

            <div className="mb-2 flex items-center -space-x-2">
              {[...Array(8)].map((_, i) => (
                <Avatar key={i} className="size-9 border-2 border-background">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 20}`} />
                  <AvatarFallback />
                </Avatar>
              ))}
            </div>
          </div>

          <div className="mb-2 flex shrink-0 gap-2">
            {group.isJoined ? (
              <Button variant="secondary" className="gap-2" size="sm">
                <UserCheck data-icon="inline-start" /> Đã tham gia
              </Button>
            ) : (
              <Button variant="default" className="gap-2" size="sm">
                Tham gia nhóm
              </Button>
            )}
            <Button variant="secondary" className="gap-2" size="sm">
              <Share2 data-icon="inline-start" /> Chia sẻ
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="secondary" size="icon" className="size-9">
                    <MoreHorizontal data-icon="inline" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Tắt thông báo</DropdownMenuItem>
                <DropdownMenuItem>Báo cáo nhóm</DropdownMenuItem>
                {group.isJoined && <DropdownMenuItem className="text-destructive">Rời khỏi nhóm</DropdownMenuItem>}
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
                value="posts" 
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Thảo luận
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Thành viên
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Sự kiện
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                File phương tiện
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="ghost" size="icon" className="size-9 shrink-0 rounded-full bg-muted/50 text-muted-foreground">
            <Search data-icon="inline" />
          </Button>
        </div>
      </div>
    </div>
  );
}
