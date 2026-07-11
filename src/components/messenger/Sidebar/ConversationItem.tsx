import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "../interface/Conversation";
import { Users } from "lucide-react";
import type { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  userId: number;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
  userId,
}: ConversationItemProps) {
  const userOnlines = useSelector((state: RootState) => state.userOnline.onlineUsers);
  const memberConversations = conversation.members.map((member) => member.id);
  const isOnline = memberConversations.some((id) => userOnlines.includes(id));
  const isGroup = conversation.group || (conversation as any).isGroup;
  const otherMember = isGroup
    ? undefined
    : (conversation.members.find((member) => member.id !== userId) ?? conversation.members[0]);

  const title = isGroup ? conversation.name : (otherMember?.username ?? "Người dùng");
  const avatarUrl = otherMember?.avatarUrl;
  const initials = title
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
        "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isActive && "bg-muted",
      )}
    >
      <div className="relative">
        {isGroup ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground">
            <Users className="h-5 w-5" />
          </div>
        ) : (
          <Avatar className="h-11 w-11">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={title} /> : null}
            <AvatarFallback className="text-xs font-semibold">{initials || "?"}</AvatarFallback>
          </Avatar>
        )}

        <span
          className={cn(
            "absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-background",
            isOnline ? "bg-green-500" : "bg-amber-400",
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {isGroup ? "Cuộc trò chuyện nhóm" : "Trò chuyện riêng"}
        </p>
      </div>
    </button>
  );
}
