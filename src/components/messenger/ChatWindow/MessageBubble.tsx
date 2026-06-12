import type { Message } from "@/stores/chatSlice";
import { cn } from "@/lib/utils";
import { Phone, Video, PhoneMissed } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  senderAvatar?: string;
  senderName?: string;
  currentUserId?: string | number;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} giây`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} phút ${s} giây` : `${m} phút`;
}

export default function MessageBubble({
  message,
  showAvatar,
  senderAvatar,
  senderName,
  currentUserId,
}: MessageBubbleProps) {
  const isMine = String(message.senderId) === String(currentUserId);
  const isCall = message.messageType === "VIDEO_CALL" || message.messageType === "AUDIO_CALL";
  const isMissed = isCall && (!message.callDuration || message.callDuration === 0);

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
        {isCall ? (
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm leading-relaxed transition-all",
              isMine ? "rounded-br-md" : "rounded-bl-md",
              isMissed
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-secondary text-foreground",
            )}
          >
            {isMissed ? (
              <PhoneMissed className="size-4 flex-shrink-0" />
            ) : message.messageType === "VIDEO_CALL" ? (
              <Video className="size-4 flex-shrink-0" />
            ) : (
              <Phone className="size-4 flex-shrink-0" />
            )}
            <span>
              {isMissed
                ? "Cuộc gọi nhỡ"
                : message.messageType === "VIDEO_CALL"
                  ? `Cuộc gọi video đã kết thúc · ${formatDuration(message.callDuration!)}`
                  : `Cuộc gọi thoại đã kết thúc · ${formatDuration(message.callDuration!)}`}
            </span>
          </div>
        ) : (
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
        )}

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
