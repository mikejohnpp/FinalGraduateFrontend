import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/types/messenger";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary",
        isActive && "bg-secondary"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="size-12">
          {conversation.isGroup ? (
            <AvatarFallback className="bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage
                src={conversation.avatar}
                alt={conversation.name}
              />
              <AvatarFallback>
                {conversation.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(-2)
                  .join("")}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        {conversation.isOnline && !conversation.isGroup && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "truncate text-sm",
              conversation.unreadCount
                ? "font-semibold text-foreground"
                : "text-foreground"
            )}
          >
            {conversation.name}
          </span>
          <span
            className={cn(
              "flex-shrink-0 text-xs",
              conversation.unreadCount
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            {conversation.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-xs",
              conversation.unreadCount
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {conversation.lastMessage}
          </span>
          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="flex-shrink-0 rounded-full px-1.5 py-0 text-[10px] font-bold leading-5"
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
