import type { Message } from "@/types/messenger";
import { CURRENT_USER_ID } from "@/data/mock/messengerData";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  senderAvatar?: string;
  senderName?: string;
}

export default function MessageBubble({
  message,
  showAvatar,
  senderAvatar,
  senderName,
}: MessageBubbleProps) {
  const isMine = message.senderId === CURRENT_USER_ID;

  return (
    <div
      className={cn("group flex items-end gap-2 px-4", isMine ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar placeholder for alignment */}
      {!isMine && (
        <div className="size-7 flex-shrink-0">
          {showAvatar && senderAvatar && (
            <img src={senderAvatar} alt={senderName} className="size-7 rounded-full object-cover" />
          )}
        </div>
      )}

      <div
        className={cn("flex max-w-[65%] flex-col gap-0.5", isMine ? "items-end" : "items-start")}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-sm leading-relaxed transition-all",
            isMine
              ? "rounded-br-md bg-[#0084FF] text-white"
              : "rounded-bl-md bg-secondary text-foreground",
          )}
        >
          {message.content}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={cn(
              "-mt-1.5 flex items-center gap-0.5 px-1",
              isMine ? "flex-row-reverse" : "flex-row",
            )}
          >
            {message.reactions.map((reaction, idx) => (
              <span
                key={idx}
                className="flex items-center gap-0.5 rounded-full border border-border bg-secondary px-1.5 py-0.5 text-xs shadow-sm"
              >
                <span>{reaction.emoji}</span>
                {reaction.count > 1 && (
                  <span className="text-muted-foreground">{reaction.count}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp on hover */}
        <span className="px-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
