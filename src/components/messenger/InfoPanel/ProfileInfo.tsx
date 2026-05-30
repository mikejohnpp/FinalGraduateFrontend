import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/messenger";
import { User, BellOff, Search } from "lucide-react";

interface ProfileInfoProps {
  conversation: Conversation;
}

export default function ProfileInfo({ conversation }: ProfileInfoProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6">
      <Avatar className="size-20">
        <AvatarImage src={conversation.avatar} alt={conversation.name} />
        <AvatarFallback className="text-2xl">
          {conversation.name
            .split(" ")
            .map((n) => n[0])
            .slice(-2)
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-0.5">
        <h3 className="text-lg font-semibold text-foreground">{conversation.name}</h3>
        <span className="text-xs text-muted-foreground">
          {conversation.isOnline ? "Đang hoạt động" : "Không hoạt động"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex flex-col items-center gap-1">
          <Button variant="secondary" size="icon" className="size-9 rounded-full">
            <User data-icon />
          </Button>
          <span className="text-[11px] text-muted-foreground">Trang cá nhân</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button variant="secondary" size="icon" className="size-9 rounded-full">
            <BellOff data-icon />
          </Button>
          <span className="text-[11px] text-muted-foreground">Tắt thông báo</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button variant="secondary" size="icon" className="size-9 rounded-full">
            <Search data-icon />
          </Button>
          <span className="text-[11px] text-muted-foreground">Tìm kiếm</span>
        </div>
      </div>
    </div>
  );
}
