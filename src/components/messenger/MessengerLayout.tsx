import { useState, useEffect } from "react";
import Sidebar from "@/components/messenger/Sidebar/Sidebar";
import http from "@/lib/http";
import { useDispatch, useSelector } from "react-redux";
import type { Conversation } from "./interface/Conversation";
import chatSlice from "@/stores/chatSlice";

export default function MessengerLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<any>(null);
  const userId = useSelector((state: any) => state.user?.userId);
  const dispatch = useDispatch();
  useEffect(() => {
    http
      .get(`/chat/conversations/user/${userId}`)
      .then((res: any) => {
        setConversations(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch conversations", err);
      });
  }, []);

  const onSelectConversation = (id: any) => {
    dispatch(chatSlice.actions.setConversationId(id));
    setActiveConversationId(id);
  };
  const onConversationCreated = () => {
    http.get(`/chat/conversations/user/${userId}`).then((res: any) => {
      setConversations(res.data);
    });
  };
  return (
    <div className="flex h-[calc(100svh-62px)] w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        userId={userId}
        onSelectConversation={onSelectConversation}
        onConversationCreated={onConversationCreated}
      />

      {/* Chat Window */}
      {/* <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        onSendMessage={handleSendMessage}
        onToggleInfo={() => setShowInfoPanel((p) => !p)}
        showInfo={showInfoPanel}
      /> */}

      {/* Info Panel */}
      {/* {showInfoPanel && (
        <InfoPanel conversation={activeConversation} onClose={() => setShowInfoPanel(false)} />
      )} */}
    </div>
  );
}
