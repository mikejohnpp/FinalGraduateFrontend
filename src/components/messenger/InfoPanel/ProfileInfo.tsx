import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { MessageChat } from "@/stores/chatSlice";
import { User, BellOff, Search } from "lucide-react";

interface ProfileInfoProps {
  chatInfo: MessageChat | undefined;
  userId?: number;
}

export default function ProfileInfo({ chatInfo, userId }: ProfileInfoProps) {
  console.log("ProfileInfo chatInfo:", chatInfo);
  const otherMember = chatInfo?.group
    ? undefined
    : (chatInfo?.members.find((member) => member.id !== userId) ?? chatInfo?.members[0]);

  const title = chatInfo?.group
    ? chatInfo.conversationName
    : (otherMember?.username ?? "Người dùng");
  const avatarUrl = otherMember?.avatarUrl;
  const initials = title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6">
      <Avatar className="size-20">
        <AvatarImage src={avatarUrl} alt={title} />
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-0.5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {/* <span className="text-xs text-muted-foreground">
          {conversation.isOnline ? "Đang hoạt động" : "Không hoạt động"}
        </span> */}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-2">
        {chatInfo?.group === false && (
          <div className="flex flex-col items-center gap-1">
            <Button variant="secondary" size="icon" className="size-9 rounded-full">
              <User data-icon />
            </Button>
            <span className="text-[11px] text-muted-foreground">Trang cá nhân</span>
          </div>
        )}

        {/* <div className="flex flex-col items-center gap-1">
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
        </div> */}
      </div>
    </div>
  );
}
