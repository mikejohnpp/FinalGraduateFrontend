import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/messenger";
import { Phone, Video, Info } from "lucide-react";

interface ChatHeaderProps {
  conversation: Conversation;
  onToggleInfo: () => void;
  showInfo: boolean;
}

export default function ChatHeader({ conversation, onToggleInfo, showInfo }: ChatHeaderProps) {
  return (
    <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>
              {conversation.name
                .split(" ")
                .map((n) => n[0])
                .slice(-2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          {conversation.isOnline && (
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{conversation.name}</span>
          <span className="text-xs text-muted-foreground">
            {conversation.isOnline ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <Phone data-icon />
        </Button>
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <Video data-icon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`size-9 rounded-full ${showInfo ? "bg-primary/10 text-primary" : "text-primary"}`}
          onClick={onToggleInfo}
        >
          <Info data-icon />
        </Button>
      </div>
    </div>
  );
}
