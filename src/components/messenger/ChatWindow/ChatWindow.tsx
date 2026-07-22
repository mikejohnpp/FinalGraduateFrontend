import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import type { MessageChat } from "@/stores/chatSlice";

interface ChatWindowProps {
  chatInfo: MessageChat;
  userId: number;
  onSendMessage: (content: string, messageType?: any) => void;
  setOpenInfoPanel: (open: boolean) => void;
  handleRemoveActiveConversation: () => void;
}

export default function ChatWindow({
  chatInfo,
  userId,
  onSendMessage,
  setOpenInfoPanel,
  handleRemoveActiveConversation,
}: ChatWindowProps) {
  return (
    <div className="mt-12 flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:mt-0">
      <ChatHeader
        chatInfo={chatInfo}
        userId={userId}
        setOpenInfoPanel={setOpenInfoPanel}
        handleRemoveActiveConversation={handleRemoveActiveConversation}
      />
      <MessageList chatInfo={chatInfo} userId={userId} />
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
