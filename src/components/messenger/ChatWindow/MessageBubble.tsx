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
  const isMine = String(message.user.id) === String(currentUserId);
  const isCall = message.messageType === "VIDEO_CALL" || message.messageType === "AUDIO_CALL";
  const isMissed = isCall && (!message.callDuration || message.callDuration === 0);

  return (
    <div
      className={cn("group flex items-end gap-2 px-4", isMine ? "flex-row-reverse" : "flex-row")}
    >
      {!isMine && (
        <div className="size-7 shrink-0">
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
        ) : message.messageType === "IMAGE" ? (
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src={message.content}
              alt="Sent image"
              className="max-h-60 max-w-full object-cover"
            />
          </div>
        ) : message.messageType === "FILE" ? (
          <div
            className={cn(
              "rounded-2xl px-3 py-2 text-sm leading-relaxed transition-all flex items-center gap-2 cursor-pointer hover:opacity-90",
              isMine
                ? "rounded-br-md bg-[#0084FF] text-white"
                : "rounded-bl-md bg-secondary text-foreground",
            )}
            onClick={() => window.open(message.content, "_blank")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            <span className="underline-offset-4 hover:underline break-all">
              {message.content.split("/").pop() || "Tệp tin đính kèm"}
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

        <span className="px-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) : ""}
        </span>
      </div>
    </div>
  );
}
