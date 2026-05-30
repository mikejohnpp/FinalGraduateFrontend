import { useState, useCallback } from "react";
import Sidebar from "@/components/messenger/Sidebar/Sidebar";
import ChatWindow from "@/components/messenger/ChatWindow/ChatWindow";
import InfoPanel from "@/components/messenger/InfoPanel/InfoPanel";
import {
  conversations as initialConversations,
  messages as initialMessages,
  CURRENT_USER_ID,
} from "@/data/mock/messengerData";
import type { Message } from "@/types/messenger";

export default function MessengerLayout() {
  const [conversations] = useState(initialConversations);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages);
  const [activeConversationId, setActiveConversationId] = useState("1");
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = messagesMap[activeConversationId] ?? [];

  const handleSendMessage = useCallback(
    (content: string) => {
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        content,
        senderId: CURRENT_USER_ID,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
      };
      setMessagesMap((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] ?? []), newMessage],
      }));
    },
    [activeConversationId],
  );

  if (!activeConversation) return null;

  return (
    <div className="flex h-[calc(100svh-62px)] w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />

      {/* Chat Window */}
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        onSendMessage={handleSendMessage}
        onToggleInfo={() => setShowInfoPanel((p) => !p)}
        showInfo={showInfoPanel}
      />

      {/* Info Panel */}
      {showInfoPanel && (
        <InfoPanel conversation={activeConversation} onClose={() => setShowInfoPanel(false)} />
      )}
    </div>
  );
}
