import type { IGroup } from "@/types/interfaces/group/IGroup";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
  group: IGroup;
  onDismiss?: () => void;
  onJoin?: () => void;
  className?: string;
  /** Custom footer content. When provided, replaces the default "Tham gia nhóm" button. */
  footer?: ReactNode;
  /** Custom subtitle below the group name (defaults to member count). */
  subtitle?: ReactNode;
}

export default function GroupCard({
  group,
  onDismiss,
  onJoin,
  className,
  footer,
  subtitle,
}: GroupCardProps) {
  const navigate = useNavigate();
  const coverUrl = resolveUploadUrl(group.coverPhoto);
  const initial = group.name?.trim().charAt(0).toUpperCase() || "?";

  const goToGroup = () => navigate(`/groups/${group.id}`);

  return (
    <Card className={cn("relative flex h-full flex-col overflow-hidden", className)}>
      <div
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={goToGroup}
        role="link"
        aria-label={group.name}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={group.name}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-5xl font-bold text-primary/70">{initial}</span>
          </div>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 size-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={onDismiss}
          >
            <X data-icon="inline" />
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p
          className="line-clamp-2 cursor-pointer text-sm leading-tight font-semibold hover:underline"
          onClick={goToGroup}
        >
          {group.name}
        </p>
        {subtitle !== undefined ? (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            {group.memberCount.toLocaleString("vi-VN")} thành viên
          </p>
        )}

        {group.mutualFriendCount && group.mutualFriendCount > 0 ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center -space-x-1">
              {/* Fake avatars for mutual friends */}
              {Array.from({ length: Math.min(group.mutualFriendCount, 3) }).map((_, i) => (
                <Avatar key={i} className="size-5 border-2 border-background">
                  <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                    B
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="truncate text-[11px] text-muted-foreground">
              {group.mutualFriendCount > 0 && `${group.mutualFriendCount} bạn chung`}
            </p>
          </div>
        ) : (
          <div className="mt-2" />
        )}

        <div className="mt-auto pt-3">
          {footer !== undefined ? (
            footer
          ) : group.isPending ? (
            <Button variant="outline" className="w-full bg-secondary/50" size="sm" disabled>
              Đang chờ duyệt
            </Button>
          ) : (
            <Button variant="outline" className="w-full bg-secondary/50" size="sm" onClick={onJoin}>
              Tham gia nhóm
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
