import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import InfoAccordion from "./InfoAccordion";
import type { MessageChat } from "@/stores/chatSlice";
import { useEffect, useState } from "react";
import http from "@/lib/http";
import type { MediaManager } from "@/stores/mediaSlice";
import { useDispatch } from "react-redux";
import mediaSlice from "@/stores/mediaSlice";
import MediaManageConversation from "./MediaManagerConversation";

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
  const [isOpenManagerFileOrImage, setIsOpenManagerFileOrImage] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!activeConversationId) return;
    http
      .get(`/chat/conversations/conversationImageAndFile/${activeConversationId}`)
      .then((res: any) => {
        console.log("conversationImageAndFile", res);
        const data = res.data;
        const newMediaManager: MediaManager = {
          conversationId: data.conversationId,
          members: data.members,
          messages: data.messages,
        };
        dispatch(mediaSlice.actions.setMediaManager(newMediaManager));
      })
      .catch((err) => {
        console.error("Failed to fetch conversationImageAndFile", err);
      });
  }, [activeConversationId]);
  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      {isOpenManagerFileOrImage ? (
        <MediaManageConversation setIsOpenManagerFileOrImage={setIsOpenManagerFileOrImage} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <h2 className="text-base font-semibold text-foreground">Thông tin về đoạn chat</h2>
            <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={onClose}>
              <X data-icon />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <ProfileInfo chatInfo={chatInfo} userId={userId} />
            <Separator />
            <InfoAccordion setIsOpenManagerFileOrImage={setIsOpenManagerFileOrImage} />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
