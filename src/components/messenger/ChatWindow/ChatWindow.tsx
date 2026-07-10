import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import type { MessageChat } from "@/stores/chatSlice";

interface ChatWindowProps {
  chatInfo: MessageChat;
  userId: number;
  onSendMessage: (content: string, messageType?: any) => void;
}

export default function ChatWindow({ chatInfo, userId, onSendMessage }: ChatWindowProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <ChatHeader chatInfo={chatInfo} userId={userId} />
      <MessageList chatInfo={chatInfo} userId={userId} />
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
