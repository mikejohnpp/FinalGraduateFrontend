import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import InfoAccordion from "./InfoAccordion";
import type { MessageChat } from "@/stores/chatSlice";
import { useEffect } from "react";
import http from "@/lib/http";

interface InfoPanelProps {
  activeConversationId: number | null;
  chatInfo?: MessageChat;
  onClose: () => void;
  userId?: number;
}

export default function InfoPanel({
  activeConversationId,
  chatInfo,
  onClose,
  userId,
}: InfoPanelProps) {
  useEffect(() => {
    if (!activeConversationId) return;

    http
      .get(`/chat/conversations/conversationImageAndFile/${activeConversationId}`)
      .then((res) => {
        console.log("conversationImageAndFile", res);
      })
      .catch((err) => {
        console.error("Failed to fetch conversationImageAndFile", err);
      });
  }, [activeConversationId]);
  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-base font-semibold text-foreground">Thông tin về đoạn chat</h2>
        <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={onClose}>
          <X data-icon />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <ProfileInfo chatInfo={chatInfo} userId={userId} />
        <Separator />
        <InfoAccordion />
      </ScrollArea>
    </div>
  );
}
