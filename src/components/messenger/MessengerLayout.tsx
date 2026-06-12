import { useState, useEffect } from "react";
import Sidebar from "@/components/messenger/Sidebar/Sidebar";
import http from "@/lib/http";
import { useDispatch, useSelector } from "react-redux";
import type { Conversation } from "./interface/Conversation";
import chatSlice from "@/stores/chatSlice";
import ChatWindow from "./ChatWindow/ChatWindow";
import { stompClient } from "@/websocket/stompClient";
import { sendMessage } from "@/websocket/chatSocket";

export default function MessengerLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<any>(null);
  const userId = useSelector((state: any) => state.user?.userId);
  const conversationId = useSelector((state: any) => state.chat.conversationId);
  const connected = useSelector((state: any) => state.socket.connected);
  const chatInfo = useSelector((state: any) => state.chat.chatInfo);
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

  useEffect(() => {
    if (!conversationId || !connected) return;
    http
      .get(`/chat/conversations/conversation/${conversationId}`)
      .then((res: any) => {
        console.log("Fetched conversation details:", res.data);
        dispatch(chatSlice.actions.setChatList(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch conversation details", err);
      });
  }, [conversationId, connected]);

  const onSelectConversation = (id: any) => {
    dispatch(chatSlice.actions.setConversationId(id));
    setActiveConversationId(id);
  };

  const onConversationCreated = () => {
    http.get(`/chat/conversations/user/${userId}`).then((res: any) => {
      setConversations(res.data);
    });
  };
  const onSendMessage = (content: string) => {
    if (content.trim() === "") return;
    sendMessage({
      conversationId,
      content,
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
      {activeConversationId && chatInfo && (
        <ChatWindow chatInfo={chatInfo} userId={userId} onSendMessage={onSendMessage} />
      )}

      {/* Info Panel */}
      {/* {showInfoPanel && (
        <InfoPanel conversation={activeConversation} onClose={() => setShowInfoPanel(false)} />
      )} */}
    </div>
  );
}
