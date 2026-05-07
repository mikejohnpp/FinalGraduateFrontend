import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import type { Message, Conversation } from "@/types/messenger";
import { CURRENT_USER_ID } from "@/data/mock/messengerData";

interface MessageListProps {
  messages: Message[];
  conversation: Conversation;
}

export default function MessageList({
  messages,
  conversation,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="min-h-0 flex-1 overflow-hidden py-4">
      <div className="flex flex-col gap-1">
        {/* Start of conversation */}
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="size-16 overflow-hidden rounded-full bg-secondary">
            {conversation.avatar ? (
              <img
                src={conversation.avatar}
                alt={conversation.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-lg font-semibold text-muted-foreground">
                {conversation.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(-2)
                  .join("")}
              </div>
            )}
          </div>
          <p className="text-base font-semibold text-foreground">
            {conversation.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Các bạn là bạn bè trên Facebook
          </p>
        </div>

        {/* Messages */}
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const showAvatar =
            msg.senderId !== CURRENT_USER_ID &&
            (!prevMsg || prevMsg.senderId !== msg.senderId);

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              showAvatar={showAvatar}
              senderAvatar={conversation.avatar}
              senderName={conversation.name}
            />
          );
        })}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
