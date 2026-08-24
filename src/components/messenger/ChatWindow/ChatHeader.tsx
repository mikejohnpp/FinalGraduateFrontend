import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { MessageChat } from "@/stores/chatSlice";
import { Phone, Video, Info, UserPlus, ChevronLeft } from "lucide-react";
import AddMemberDialog from "./AddMemberDialog";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  chatInfo: MessageChat;
  userId: number;
  setOpenInfoPanel: (open: boolean) => void;
  handleRemoveActiveConversation: () => void;
}

export default function ChatHeader({
  chatInfo,
  userId,
  setOpenInfoPanel,
  handleRemoveActiveConversation,
}: ChatHeaderProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { startCall } = useWebRTC();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const otherMember = chatInfo.group
    ? undefined
    : (chatInfo.members.find((member) => member.id !== userId) ?? chatInfo.members[0]);
  const goToProfile = () => {
    if (chatInfo.group) {
      return;
    }
    navigate(`/profile/${otherMember?.id}`);
  };
  const title = chatInfo.group
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
    <div className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        {isMobile && (
          <div>
            <ChevronLeft onClick={handleRemoveActiveConversation} />
          </div>
        )}

        <div className="relative">
          <Avatar className="size-10 hover:cursor-pointer" onClick={goToProfile}>
            <AvatarImage src={otherMember?.avatarUrl} alt={chatInfo.conversationName} />
            <AvatarFallback>{initials || "?"}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {chatInfo.conversationName || otherMember?.username || "Người dùng"}
          </span>
          {chatInfo.group && (
            <span className="text-xs text-muted-foreground">
              {chatInfo.members.length} thành viên
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {chatInfo.group === false && isMobile === false && otherMember && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-primary"
              onClick={() => startCall(otherMember.id, chatInfo.conversationId, false)}
            >
              <Phone data-icon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-primary"
              onClick={() => startCall(otherMember.id, chatInfo.conversationId, true)}
            >
              <Video data-icon />
            </Button>
          </>
        )}
        {chatInfo.group && (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-primary"
            onClick={() => setIsAddMemberOpen(true)}
            title="Thêm thành viên"
          >
            <UserPlus data-icon />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-primary"
          onClick={() => setOpenInfoPanel(true)}
          title="Thông tin đoạn chat"
        >
          <Info data-icon />
        </Button>
      </div>
      {chatInfo.group && (
        <AddMemberDialog
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
          userId={userId}
          chatInfo={chatInfo}
        />
      )}
    </div>
  );
}
