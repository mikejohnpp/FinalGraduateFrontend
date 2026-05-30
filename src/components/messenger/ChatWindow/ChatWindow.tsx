import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import type { Message, Conversation } from "@/types/messenger";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onToggleInfo: () => void;
  showInfo: boolean;
}

export default function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onToggleInfo,
  showInfo,
}: ChatWindowProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <ChatHeader conversation={conversation} onToggleInfo={onToggleInfo} showInfo={showInfo} />
      <MessageList messages={messages} conversation={conversation} />
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
