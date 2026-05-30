import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProfileInfo from "./ProfileInfo";
import InfoAccordion from "./InfoAccordion";
import type { Conversation } from "@/types/messenger";

interface InfoPanelProps {
  conversation: Conversation;
  onClose: () => void;
}

export default function InfoPanel({ conversation, onClose }: InfoPanelProps) {
  return (
    <div className="flex h-full w-[320px] flex-shrink-0 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-base font-semibold text-foreground">Thông tin về đoạn chat</h2>
        <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={onClose}>
          <X data-icon />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <ProfileInfo conversation={conversation} />
        <Separator />
        <InfoAccordion />
      </ScrollArea>
    </div>
  );
}
