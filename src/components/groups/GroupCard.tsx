import type { Group } from "@/types/Group";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: Group;
  onDismiss?: () => void;
  onJoin?: () => void;
  className?: string;
}

export default function GroupCard({ group, onDismiss, onJoin, className }: GroupCardProps) {
  return (
    <Card className={cn("relative flex h-full flex-col overflow-hidden", className)}>
      <div className="relative aspect-[16/9]">
        <img src={group.coverPhoto} alt={group.name} className="size-full object-cover" />
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1 size-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={onDismiss}
          >
            <X data-icon="inline" />
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-tight">{group.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {group.memberCount.toLocaleString("vi-VN")} thành viên
          {group.postFrequency && ` · ${group.postFrequency}`}
        </p>
        
        {group.mutualFriendCount && group.mutualFriendCount > 0 ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center -space-x-1">
              {/* Fake avatars for mutual friends */}
              {Array.from({ length: Math.min(group.mutualFriendCount, 3) }).map((_, i) => (
                <Avatar key={i} className="size-5 border-2 border-background">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                  <AvatarFallback />
                </Avatar>
              ))}
            </div>
            <p className="truncate text-[11px] text-muted-foreground">
              {group.mutualFriends?.join(", ")} {group.mutualFriendCount > (group.mutualFriends?.length || 0) && "và những người khác"}
            </p>
          </div>
        ) : <div className="mt-2" />}
        
        <div className="mt-auto pt-3">
          <Button variant="outline" className="w-full bg-secondary/50" size="sm" onClick={onJoin}>
            Tham gia nhóm
          </Button>
        </div>
      </div>
    </Card>
  );
}
